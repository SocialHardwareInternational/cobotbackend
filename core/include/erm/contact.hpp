// erm/contact.hpp -- sensorless EXTERNAL-CONTACT (physical collision) detection.
//
// Method (Universal Robots servo-current monitoring; De Luca & Mattone / Haddadin momentum-
// residual; UR10 current-residual case study): estimate the external joint torque as the
// RESIDUAL between the MEASURED joint torque (from motor current, 0x6077) and the MODEL-expected
// torque (RNEA inverse dynamics M(q)q'' + C(q,q')q' + g(q) + friction). In free motion the model
// matches the drives, so the residual ~ 0; when the arm touches/hits something an external force
// acts on it and the residual spikes on the affected joints -> contact.
//
// Accuracy in practice needs: (1) a friction term (else false positives), (2) filtering (motor
// torque + finite-difference q'' are noisy), (3) a VELOCITY-DEPENDENT dynamic threshold (model
// error grows with speed) so a fast free move doesn't nuisance-trip, and (4) BASELINE tracking so
// a constant model/friction bias on uncalibrated hardware does not nuisance-trip -- contact is a
// sudden DEVIATION from the slow baseline. SENSITIVITY (0..1) scales the threshold: higher =
// detects a lighter touch (but more nuisance stops), exactly like UR's adjustable force limit.
// On detection the control node applies a PROTECTIVE STOP (disable/hold); the hardware E-stop /
// STO stays independent.
#pragma once
#include <array>
#include <cmath>
#include "erm/erobo10_dh.hpp"     // NJ, jointEffortMax
#include "erm/dynamics.hpp"       // inverseDynamics, Vec3a

namespace erm {

// Coarse per-joint Coulomb + viscous friction [Nm]. Scaled to joint size; refine on hardware.
inline std::array<double,NJ> frictionTorque(const std::array<double,NJ>& qd){
    static const double fc[NJ]={6.0,6.0,3.0,1.2,1.2,1.2};   // Coulomb (Nm)
    static const double fv[NJ]={8.0,8.0,4.0,1.5,1.5,1.5};   // viscous (Nm/(rad/s))
    std::array<double,NJ> f{};
    for(int i=0;i<NJ;++i){ double s = qd[i]>0.02?1.0:(qd[i]<-0.02?-1.0:qd[i]/0.02);
        f[i]=fc[i]*s + fv[i]*qd[i]; }
    return f;
}

struct ContactResult { bool contact; int joint; double resid[NJ]; double margin; };  // margin=worst |resid|/thr

struct ContactDetector {
    double sensitivity = 0.5;                        // 0..1 (higher = more sensitive)
    double base[NJ] = {40.0,40.0,24.0,10.0,10.0,10.0}; // base residual threshold [Nm] -- conservative (uncalibrated model). Lower via sensitivity.
    double kv[NJ]   = {12.0,12.0,8.0,4.0,4.0,4.0};    // dynamic-threshold slope [Nm per rad/s] -- bigger margin at speed
    double lp_res   = 0.20;                          // fast residual low-pass (EMA) coeff (0..1)
    double lp_base  = 0.004;                         // SLOW baseline EMA -> tracks steady model/friction bias
    int    debounce = 10;                            // consecutive over-threshold cycles to trip (rejects transient spikes)
    int    warmup_n = 800;                           // cycles after reset: learn baseline, don't trip
    std::array<double,NJ> resf{}, basef{}; int over_cnt=0, warmup=0;

    // per-joint threshold: sensitivity 1 -> 0.15x base ; 0 -> 2.0x base ; plus a speed term.
    double thr(int i, double qd_i) const {
        double s = 0.15 + (1.0 - sensitivity)*1.85;
        return base[i]*s + kv[i]*std::fabs(qd_i);
    }

    // one cycle. tau_meas [Nm] = measured joint torque; q,qd,qdd measured; payload+cog for the model.
    // Contact = a SUDDEN DEVIATION of the residual from its slow baseline, so a constant model/
    // friction error (uncalibrated hardware) sits in the baseline and does NOT nuisance-trip.
    ContactResult update(const std::array<double,NJ>& tau_meas,
                         const std::array<double,NJ>& q, const std::array<double,NJ>& qd,
                         const std::array<double,NJ>& qdd, double payload, const Vec3a& cog){
        auto tau_model = inverseDynamics(q, qd, qdd, payload, cog);
        auto tau_fric  = frictionTorque(qd);
        ContactResult r{false,-1,{0},0.0};
        double worst=0.0; int wj=-1;
        bool warming = (warmup>0);
        for(int i=0;i<NJ;++i){
            double res = tau_meas[i] - (tau_model[i] + tau_fric[i]);   // raw external-torque estimate
            resf[i] += lp_res*(res - resf[i]);                          // fast low-pass
            double dev = resf[i] - basef[i];                            // deviation from steady baseline
            r.resid[i]=dev;
            double m = std::fabs(dev) / thr(i, qd[i]);
            if(m>worst){ worst=m; wj=i; }
        }
        r.margin=worst;
        // adapt the baseline: fast during warm-up, slow afterwards, and FROZEN while a contact is
        // building (worst>=1) so the contact torque never leaks into the baseline.
        if(warming || worst<1.0){ double a = warming? 0.05 : lp_base;
            for(int i=0;i<NJ;++i) basef[i] += a*(resf[i]-basef[i]); }
        if(warming){ warmup--; over_cnt=0; return r; }                  // no trips while learning baseline
        if(worst>=1.0){ if(++over_cnt>=debounce){ r.contact=true; r.joint=wj; } }
        else over_cnt=0;
        return r;
    }
    void reset(){ resf.fill(0.0); basef.fill(0.0); over_cnt=0; warmup=warmup_n; }
};

}  // namespace erm
