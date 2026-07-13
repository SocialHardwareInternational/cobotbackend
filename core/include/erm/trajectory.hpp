// erm/trajectory.hpp -- jerk-limited (S-curve) trajectory generation.
//
// This is the anti-jitter core. Every motion is C2-continuous (continuous
// position, velocity AND acceleration) and respects per-axis velocity,
// acceleration and jerk limits -> no torque/velocity steps, no jitter at the
// drives. Replaces the jittery UDP-streamed setpoints.
//
//  * ScurveProfile  : rest-to-rest jerk-limited scalar profile (7-phase double-S).
//  * JointTrajectory: synchronized multi-joint PTP (all joints arrive together).
//  * CartesianTrajectory: straight-line (LIN) pose path, SLERP orientation,
//                         jerk-limited along the path, joints via warm-started IK.
#pragma once
#include <algorithm>
#include <cmath>
#include <vector>
#include "erm/ik.hpp"
#include "erm/kinematics.hpp"
#include "erm/tcp.hpp"

namespace erm {

struct Kin { double x = 0, v = 0, a = 0; };

class ScurveProfile {
   public:
    void plan(double D, double V, double A, double J) {
        sign_ = (D < 0) ? -1.0 : 1.0;
        D_ = std::abs(D); V_ = V; A_ = A; J_ = J;
        phases_.clear(); bnd_.clear(); T_ = 0;
        if (D_ < 1e-12 || V <= 0 || A <= 0 || J <= 0) return;
        double Vp = peakVel(D_);
        build(Vp);
    }
    double duration() const { return T_; }
    // signed (x,v,a) at time t
    Kin sample(double t) const {
        if (phases_.empty()) return {0, 0, 0};
        if (t <= 0) return {0, 0, 0};
        if (t >= T_) return {sign_ * D_, 0, 0};
        size_t i = 0;
        while (i + 1 < bnd_.size() && t >= bnd_[i + 1].t0) ++i;
        double dt = t - bnd_[i].t0; double j = bnd_[i].jerk; Kin s = bnd_[i].s;
        Kin r;
        r.x = s.x + s.v * dt + 0.5 * s.a * dt * dt + j * dt * dt * dt / 6.0;
        r.v = s.v + s.a * dt + 0.5 * j * dt * dt;
        r.a = s.a + j * dt;
        return {sign_ * r.x, sign_ * r.v, sign_ * r.a};
    }

   private:
    struct Bnd { double t0, jerk; Kin s; };
    double D_=0, V_=0, A_=0, J_=0, T_=0, sign_=1;
    std::vector<std::pair<double,double>> phases_;  // (jerk, dur)
    std::vector<Bnd> bnd_;

    void ramps(double Vp, double& Tj, double& Ta) const {
        if (A_ * A_ <= Vp * J_) { Tj = A_ / J_; Ta = Vp / A_ - Tj; }
        else { Tj = std::sqrt(Vp / J_); Ta = 0; }
        if (Ta < 0) Ta = 0;
    }
    static void integ(Kin& s, double j, double dt) {
        s.x += s.v*dt + 0.5*s.a*dt*dt + j*dt*dt*dt/6.0;
        s.v += s.a*dt + 0.5*j*dt*dt;
        s.a += j*dt;
    }
    double rampDist(double Vp) const {   // distance to accelerate 0 -> Vp
        double Tj, Ta; ramps(Vp, Tj, Ta);
        Kin s{0,0,0}; integ(s, J_, Tj); integ(s, 0, Ta); integ(s, -J_, Tj);
        return s.x;
    }
    double peakVel(double D) const {
        if (2.0 * rampDist(V_) <= D) return V_;        // cruise at V
        double lo = 0, hi = V_;
        for (int it = 0; it < 100; ++it) {             // bisection on peak velocity
            double mid = 0.5 * (lo + hi);
            if (2.0 * rampDist(mid) <= D) lo = mid; else hi = mid;
        }
        return 0.5 * (lo + hi);
    }
    void build(double Vp) {
        double Tj, Ta; ramps(Vp, Tj, Ta);
        double Tv = (Vp > 1e-12) ? std::max(0.0, (D_ - 2.0 * rampDist(Vp)) / Vp) : 0.0;
        phases_ = {{J_,Tj},{0,Ta},{-J_,Tj},{0,Tv},{-J_,Tj},{0,Ta},{J_,Tj}};
        Kin s{0,0,0}; double t = 0;
        for (auto& ph : phases_) {
            if (ph.second <= 0) continue;
            bnd_.push_back({t, ph.first, s});
            integ(s, ph.first, ph.second);
            t += ph.second;
        }
        T_ = t;
    }
};

// ---- Synchronized multi-joint PTP (jerk-limited, time-scaled to finish together)
class JointTrajectory {
   public:
    bool plan(const JVec& q0, const JVec& qf, double acc=1.0) {
        q0_ = q0; T_ = 0;
        const double *V=jointVelMax(), *A=jointAccMax(), *Jm=jointJerkMax();
        double as = acc<0.05?0.05:(acc>1.0?1.0:acc);          // accel/jerk scale (UI accel control)
        for (int i=0;i<NJ;++i){ prof_[i].plan(qf[i]-q0[i], V[i], A[i]*as, Jm[i]*as); Ti_[i]=prof_[i].duration(); T_=std::max(T_,Ti_[i]); }
        return true;
    }
    double duration() const { return T_; }
    // q, qd, qdd at time t (synchronized)
    void sample(double t, JVec& q, JVec& qd, JVec& qdd) const {
        for (int i=0;i<NJ;++i){
            double k = (T_>1e-12 && Ti_[i]>1e-12) ? Ti_[i]/T_ : 0.0;
            Kin s = prof_[i].sample(k>0 ? t*k : 0.0);
            q[i]=q0_[i]+s.x; qd[i]=s.v*k; qdd[i]=s.a*k*k;
        }
    }

   private:
    JVec q0_{}; ScurveProfile prof_[NJ]; double Ti_[NJ]{}; double T_=0;
};

// ---- Straight-line Cartesian (LIN) move: jerk-limited along the path ---------
struct CartLimits { double v=0.40, a=2.0, j=20.0;      // linear  m/s, m/s^2, m/s^3 (normal; joint vel still capped per-cycle)
                    double w=1.5, aw=8.0, jw=80.0; };  // angular rad/s, rad/s^2, rad/s^3

class CartesianTrajectory {
   public:
    bool plan(const Mat4& pose0, const Mat4& pose1, const JVec& seed, const CartLimits& lim = {}) {
        p0_ = pose0.pos(); p1_ = pose1.pos();
        q0_ = Quat::fromMat3(pose0.rot()); q1_ = Quat::fromMat3(pose1.rot());
        L_ = norm(p1_ - p0_);
        double dotq = q0_.w*q1_.w + q0_.x*q1_.x + q0_.y*q1_.y + q0_.z*q1_.z;
        ang_ = 2.0 * std::acos(std::min(1.0, std::abs(dotq)));
        seed_ = seed;
        double V=1e9, A=1e9, J=1e9;                    // limits on u in [0,1]
        if (L_ > 1e-9)  { V=std::min(V,lim.v/L_);  A=std::min(A,lim.a/L_);  J=std::min(J,lim.j/L_); }
        if (ang_ > 1e-9){ V=std::min(V,lim.w/ang_); A=std::min(A,lim.aw/ang_); J=std::min(J,lim.jw/ang_); }
        if (V > 1e8) { T_ = 0; return true; }          // no motion
        prof_.plan(1.0, V, A, J); T_ = prof_.duration();
        return true;
    }
    double duration() const { return T_; }
    double pathParam(double t) const { return (T_>1e-12) ? std::min(1.0,std::max(0.0,prof_.sample(t).x)) : 1.0; }
    Mat4 pose(double t) const {
        double u = pathParam(t);
        Vec3 pos = p0_ + (p1_ - p0_) * u;
        Quat qo = slerp(q0_, q1_, u);
        return Mat4::fromRotTrans(qo.toMat3(), pos);
    }
    // joint sample via warm-started IK; advances the internal seed for continuity.
    bool sampleJoints(double t, JVec& q) {
        IkResult r = solveIKtcp(pose(t), seed_);
        if (r.ok) { q = r.q; seed_ = r.q; return true; }
        return false;
    }
    const JVec& seed() const { return seed_; }

   private:
    Vec3 p0_{}, p1_{}; Quat q0_{}, q1_{}; double L_=0, ang_=0, T_=0;
    ScurveProfile prof_; JVec seed_{};
};

// ---- Circular (MoveC): arc through start -> via -> end (ABB MoveC / KUKA CIRC) -
// The unique circle through three points; jerk-limited along arc length, orientation
// SLERPs start->end, joints from warm-started per-step IK. Collinear points degrade to a line.
class CircularTrajectory {
   public:
    bool plan(const Mat4& start, const Mat4& via, const Mat4& end, const JVec& seed, const CartLimits& lim = {}, bool full=false) {
        Vec3 A=start.pos(), B=via.pos(), C=end.pos();
        q0_=Quat::fromMat3(start.rot()); q1_=Quat::fromMat3(end.rot()); seed_=seed;
        Vec3 ab=B-A, ac=C-A; Vec3 nrm=cross(ab,ac); double n2=dot(nrm,nrm);
        if (n2 < 1e-12) {                                  // collinear -> straight line A->C
            useLine_=true; center_=A; lineEnd_=C; double L=norm(C-A);
            double V=L>1e-9?lim.v/L:1e9, Ac=L>1e-9?lim.a/L:1e9, J=L>1e-9?lim.j/L:1e9;
            if(V>1e8){T_=0;return true;} prof_.plan(1.0,V,Ac,J); T_=prof_.duration(); return true;
        }
        double a2=dot(B-C,B-C), b2=dot(A-C,A-C), c2=dot(A-B,A-B);   // circumcenter (barycentric)
        double al=a2*(b2+c2-a2), be=b2*(c2+a2-b2), ga=c2*(a2+b2-c2), sden=al+be+ga;
        center_ = (A*al + B*be + C*ga) * (1.0/sden);
        radius_ = norm(A-center_);
        u_ = normalized(A-center_); Vec3 w=normalized(nrm); v_ = cross(w,u_);   // plane basis (A at angle 0)
        auto ang=[&](const Vec3& P){ Vec3 d=P-center_; double a=std::atan2(dot(d,v_),dot(d,u_)); return a<0?a+2*PI:a; };
        double aB=ang(B), aC=ang(C);
        sweep_ = (aB < aC) ? aC : (aC - 2*PI);             // pick the direction that passes through the via
        if (full) sweep_ = (sweep_ >= 0 ? 2*PI : -2*PI);   // 360 deg full circle (returns to start through the via)
        arcLen_ = std::fabs(sweep_)*radius_; useLine_=false;
        double V=arcLen_>1e-9?lim.v/arcLen_:1e9, Ac=arcLen_>1e-9?lim.a/arcLen_:1e9, J=arcLen_>1e-9?lim.j/arcLen_:1e9;
        if(V>1e8){T_=0;return true;} prof_.plan(1.0,V,Ac,J); T_=prof_.duration(); return true;
    }
    double duration() const { return T_; }
    Mat4 pose(double t) const {
        double u=(T_>1e-12)?std::min(1.0,std::max(0.0,prof_.sample(t).x)):1.0;
        Quat qo=slerp(q0_,q1_,u);
        if (useLine_) return Mat4::fromRotTrans(qo.toMat3(), center_+(lineEnd_-center_)*u);
        double a=sweep_*u; Vec3 p=center_ + (u_*std::cos(a)+v_*std::sin(a))*radius_;
        return Mat4::fromRotTrans(qo.toMat3(), p);
    }
    bool sampleJoints(double t, JVec& q){ IkResult r=solveIKtcp(pose(t),seed_); if(r.ok){q=r.q;seed_=r.q;return true;} return false; }
    double radius() const { return radius_; }
   private:
    Vec3 center_{},u_{},v_{},lineEnd_{}; Quat q0_{},q1_{}; double radius_=0,sweep_=0,arcLen_=0,T_=0; bool useLine_=false;
    ScurveProfile prof_; JVec seed_{};
};

// ---- MoveP: constant tool-speed path with circular blends (UR MoveP) ---------
// Straight segments joined at interior corners by a circular arc tangent to both
// legs at distance d (blend) from the vertex: R = d*tan(beta/2), beta = angle
// ABC. One jerk-limited speed profile runs over the whole arc length, so the TCP
// holds constant tool speed and never stops at a waypoint. Orientation SLERPs
// across the path. Joints come from warm-started per-step IK.
class BlendedPath {
   public:
    struct Pose { Vec3 p; Quat q; };
    bool plan(const std::vector<Pose>& wp, double blend, double v, double a, double j,
              const JVec& seed) {
        seed_ = seed; pieces_.clear(); L_ = 0;
        int n = (int)wp.size();
        if (n < 2) return false;
        q0_ = wp.front().q; q1_ = wp.back().q;
        std::vector<Vec3> P; for (auto& w : wp) P.push_back(w.p);
        auto segLen = [&](int i){ return norm(P[i+1]-P[i]); };
        Vec3 cur = P[0];
        for (int i = 1; i < n; ++i) {
            bool interior = (i <= n-2);
            double d = 0.0;
            if (interior) {
                d = std::min(blend, 0.45*std::min(segLen(i-1), segLen(i)));
            }
            if (interior && d > 1e-6) {
                Vec3 uin = normalized(P[i]-P[i-1]);
                Vec3 uout = normalized(P[i+1]-P[i]);
                double cb = std::min(1.0, std::max(-1.0, dot(uin*-1.0, uout)));
                double beta = std::acos(cb);                 // angle ABC
                Vec3 A = P[i] - uin*d, B = P[i] + uout*d;
                addLine(cur, A);
                if (PI - beta > 1e-4) {                      // a real corner
                    double R = d * std::tan(beta*0.5);
                    Vec3 bis = normalized((uin*-1.0) + uout); // into the corner
                    Vec3 O = P[i] + bis * (d / std::max(1e-9, std::cos(beta*0.5)));
                    Vec3 a0 = A - O, a1 = B - O;
                    Vec3 axis = normalized(cross(a0, a1));
                    double ang = std::acos(std::min(1.0,std::max(-1.0, dot(normalized(a0),normalized(a1)))));
                    addArc(O, a0, axis, R, ang);
                } else { addLine(A, B); }
                cur = B;
            } else {
                addLine(cur, P[i]); cur = P[i];
            }
        }
        prof_.plan(L_, v, a, j);
        return L_ > 1e-9;
    }
    double duration() const { return prof_.duration(); }
    double length() const { return L_; }
    Mat4 pose(double t) const {
        double s = std::min(L_, std::max(0.0, prof_.sample(t).x));
        Vec3 pos = posAt(s);
        Quat qo = slerp(q0_, q1_, L_>1e-9 ? s/L_ : 1.0);
        return Mat4::fromRotTrans(qo.toMat3(), pos);
    }
    bool sampleJoints(double t, JVec& q) {
        IkResult r = solveIKtcp(pose(t), seed_);
        if (r.ok) { q = r.q; seed_ = r.q; return true; }
        return false;
    }

   private:
    struct Piece { int type; double s0, s1; Vec3 p0, p1; Vec3 O, a0, axis; double R; };
    std::vector<Piece> pieces_; double L_ = 0; ScurveProfile prof_; JVec seed_{};
    Quat q0_{}, q1_{};
    void addLine(const Vec3& p0, const Vec3& p1) {
        double len = norm(p1-p0); if (len < 1e-9) return;
        pieces_.push_back({0, L_, L_+len, p0, p1, {}, {}, {}, 0}); L_ += len;
    }
    void addArc(const Vec3& O, const Vec3& a0, const Vec3& axis, double R, double ang) {
        double len = R*ang; if (len < 1e-9) return;
        pieces_.push_back({1, L_, L_+len, {}, {}, O, a0, axis, R}); L_ += len;
    }
    static Vec3 rotAxis(const Vec3& v, const Vec3& k, double a) {
        double c=std::cos(a), si=std::sin(a);
        return v*c + cross(k,v)*si + k*(dot(k,v)*(1-c));
    }
    Vec3 posAt(double s) const {
        for (auto& pc : pieces_) {
            if (s <= pc.s1 + 1e-9) {
                if (pc.type == 0) { double u=(pc.s1>pc.s0)?(s-pc.s0)/(pc.s1-pc.s0):0; return pc.p0 + (pc.p1-pc.p0)*u; }
                double phi = (s - pc.s0)/pc.R; return pc.O + rotAxis(pc.a0, pc.axis, phi);
            }
        }
        return pieces_.empty()? Vec3{} : (pieces_.back().type==0? pieces_.back().p1 : pieces_.back().O + rotAxis(pieces_.back().a0, pieces_.back().axis, (pieces_.back().s1-pieces_.back().s0)/pieces_.back().R));
    }
};

}  // namespace erm
