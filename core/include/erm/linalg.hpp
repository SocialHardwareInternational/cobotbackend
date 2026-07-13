// erm/linalg.hpp -- dependency-free linear algebra for the erobo10 motion stack.
// SE(3), SO(3) with quaternion + rotation-vector, and a dense linear solver.
// Header-only so it ports to an RT control box without external libraries.
#pragma once
#include <array>
#include <cmath>
#include <cstddef>
#include <vector>

namespace erm {

constexpr double PI = 3.14159265358979323846;

struct Vec3 {
    double x = 0, y = 0, z = 0;
    Vec3() = default;
    Vec3(double x_, double y_, double z_) : x(x_), y(y_), z(z_) {}
    double  operator[](int i) const { return (&x)[i]; }
    double& operator[](int i) { return (&x)[i]; }
    Vec3 operator+(const Vec3& o) const { return {x + o.x, y + o.y, z + o.z}; }
    Vec3 operator-(const Vec3& o) const { return {x - o.x, y - o.y, z - o.z}; }
    Vec3 operator*(double s) const { return {x * s, y * s, z * s}; }
};
inline double dot(const Vec3& a, const Vec3& b) { return a.x * b.x + a.y * b.y + a.z * b.z; }
inline Vec3 cross(const Vec3& a, const Vec3& b) {
    return {a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x};
}
inline double norm(const Vec3& a) { return std::sqrt(dot(a, a)); }
inline Vec3 normalized(const Vec3& a) { double n = norm(a); return n > 1e-15 ? a * (1.0 / n) : a; }

struct Mat3 {
    std::array<double, 9> m{};  // row-major
    double  operator()(int r, int c) const { return m[r * 3 + c]; }
    double& operator()(int r, int c) { return m[r * 3 + c]; }
    static Mat3 identity() { Mat3 r; r(0,0)=r(1,1)=r(2,2)=1; return r; }
    Mat3 operator*(const Mat3& b) const {
        Mat3 r;
        for (int i=0;i<3;++i) for (int j=0;j<3;++j){ double s=0; for(int k=0;k<3;++k) s+=(*this)(i,k)*b(k,j); r(i,j)=s; }
        return r;
    }
    Vec3 operator*(const Vec3& v) const {
        return {m[0]*v.x+m[1]*v.y+m[2]*v.z, m[3]*v.x+m[4]*v.y+m[5]*v.z, m[6]*v.x+m[7]*v.y+m[8]*v.z};
    }
    Mat3 transpose() const { Mat3 r; for(int i=0;i<3;++i) for(int j=0;j<3;++j) r(i,j)=(*this)(j,i); return r; }
    Vec3 col(int c) const { return {(*this)(0,c),(*this)(1,c),(*this)(2,c)}; }
};

inline Mat3 skew(const Vec3& v) {
    Mat3 S; S(0,1)=-v.z; S(0,2)=v.y; S(1,0)=v.z; S(1,2)=-v.x; S(2,0)=-v.y; S(2,1)=v.x; return S;
}
// RPY (XYZ fixed axes): R = Rz(yaw)Ry(pitch)Rx(roll)
inline Mat3 rpyToMat3(double r, double p, double y) {
    double cr=std::cos(r), sr=std::sin(r), cp=std::cos(p), sp=std::sin(p), cy=std::cos(y), sy=std::sin(y);
    Mat3 R;
    R(0,0)=cy*cp; R(0,1)=cy*sp*sr-sy*cr; R(0,2)=cy*sp*cr+sy*sr;
    R(1,0)=sy*cp; R(1,1)=sy*sp*sr+cy*cr; R(1,2)=sy*sp*cr-cy*sr;
    R(2,0)=-sp;   R(2,1)=cp*sr;          R(2,2)=cp*cr;
    return R;
}
inline Vec3 mat3ToRpy(const Mat3& R) {
    double pitch=std::atan2(-R(2,0), std::sqrt(R(0,0)*R(0,0)+R(1,0)*R(1,0)));
    double roll, yaw;
    if (std::abs(std::cos(pitch))>1e-9){ roll=std::atan2(R(2,1),R(2,2)); yaw=std::atan2(R(1,0),R(0,0)); }
    else { roll=std::atan2(-R(1,2),R(1,1)); yaw=0; }
    return {roll,pitch,yaw};
}
inline Mat3 rotVecToMat3(const Vec3& rv) {
    double th=norm(rv); if (th<1e-12) return Mat3::identity();
    Vec3 k=rv*(1.0/th); double c=std::cos(th), s=std::sin(th), v=1-c;
    Mat3 R;
    R(0,0)=k.x*k.x*v+c;     R(0,1)=k.x*k.y*v-k.z*s; R(0,2)=k.x*k.z*v+k.y*s;
    R(1,0)=k.y*k.x*v+k.z*s; R(1,1)=k.y*k.y*v+c;     R(1,2)=k.y*k.z*v-k.x*s;
    R(2,0)=k.z*k.x*v-k.y*s; R(2,1)=k.z*k.y*v+k.x*s; R(2,2)=k.z*k.z*v+c;
    return R;
}
// log map SO(3) -> rotation vector (axis*angle). Robust near 0 and pi.
inline Vec3 mat3ToRotVec(const Mat3& R) {
    double tr=R(0,0)+R(1,1)+R(2,2); double c=(tr-1)*0.5; c=c>1?1:(c<-1?-1:c);
    double th=std::acos(c);
    if (th<1e-9) return {0,0,0};
    if (PI-th<1e-7) {
        // near pi: use the largest diagonal for numerical stability
        int i = (R(0,0)>=R(1,1) && R(0,0)>=R(2,2))?0:((R(1,1)>=R(2,2))?1:2);
        int j=(i+1)%3, k=(i+2)%3;
        double s=std::sqrt(std::max(0.0,R(i,i)-R(j,j)-R(k,k)+1.0));
        Vec3 a; a[i]=s*0.5; a[j]=(R(j,i)+R(i,j))/(2*s); a[k]=(R(k,i)+R(i,k))/(2*s);
        return normalized(a)*th;
    }
    double s=1.0/(2*std::sin(th));
    return Vec3{(R(2,1)-R(1,2))*s,(R(0,2)-R(2,0))*s,(R(1,0)-R(0,1))*s}*th;
}

// Unit quaternion (w,x,y,z) for smooth orientation interpolation.
struct Quat {
    double w=1,x=0,y=0,z=0;
    static Quat fromMat3(const Mat3& R) {
        Quat q; double tr=R(0,0)+R(1,1)+R(2,2);
        if (tr>0){ double s=std::sqrt(tr+1.0)*2; q.w=0.25*s; q.x=(R(2,1)-R(1,2))/s; q.y=(R(0,2)-R(2,0))/s; q.z=(R(1,0)-R(0,1))/s; }
        else if (R(0,0)>R(1,1)&&R(0,0)>R(2,2)){ double s=std::sqrt(1.0+R(0,0)-R(1,1)-R(2,2))*2; q.w=(R(2,1)-R(1,2))/s; q.x=0.25*s; q.y=(R(0,1)+R(1,0))/s; q.z=(R(0,2)+R(2,0))/s; }
        else if (R(1,1)>R(2,2)){ double s=std::sqrt(1.0+R(1,1)-R(0,0)-R(2,2))*2; q.w=(R(0,2)-R(2,0))/s; q.x=(R(0,1)+R(1,0))/s; q.y=0.25*s; q.z=(R(1,2)+R(2,1))/s; }
        else { double s=std::sqrt(1.0+R(2,2)-R(0,0)-R(1,1))*2; q.w=(R(1,0)-R(0,1))/s; q.x=(R(0,2)+R(2,0))/s; q.y=(R(1,2)+R(2,1))/s; q.z=0.25*s; }
        return q.normalized();
    }
    Quat normalized() const { double n=std::sqrt(w*w+x*x+y*y+z*z); if(n<1e-15) return {1,0,0,0}; return {w/n,x/n,y/n,z/n}; }
    Quat conj() const { return {w,-x,-y,-z}; }
    Quat operator*(const Quat& q) const {
        return { w*q.w-x*q.x-y*q.y-z*q.z, w*q.x+x*q.w+y*q.z-z*q.y,
                 w*q.y-x*q.z+y*q.w+z*q.x, w*q.z+x*q.y-y*q.x+z*q.w };
    }
    Mat3 toMat3() const {
        Mat3 R; double xx=x*x,yy=y*y,zz=z*z,xy=x*y,xz=x*z,yz=y*z,wx=w*x,wy=w*y,wz=w*z;
        R(0,0)=1-2*(yy+zz); R(0,1)=2*(xy-wz);   R(0,2)=2*(xz+wy);
        R(1,0)=2*(xy+wz);   R(1,1)=1-2*(xx+zz); R(1,2)=2*(yz-wx);
        R(2,0)=2*(xz-wy);   R(2,1)=2*(yz+wx);   R(2,2)=1-2*(xx+yy);
        return R;
    }
};
// Orientation error as a rotation vector in the base frame: log(R_cur^T R_des) mapped to base.
inline Vec3 orientationError(const Mat3& R_cur, const Mat3& R_des) {
    return mat3ToRotVec(R_des * R_cur.transpose());
}
// Shortest geodesic interpolation (SLERP) between two orientations, t in [0,1].
inline Quat slerp(Quat a, Quat b, double t) {
    double d=a.w*b.w+a.x*b.x+a.y*b.y+a.z*b.z;
    if (d<0){ b.w=-b.w;b.x=-b.x;b.y=-b.y;b.z=-b.z; d=-d; }
    if (d>0.9995){ Quat r{a.w+t*(b.w-a.w),a.x+t*(b.x-a.x),a.y+t*(b.y-a.y),a.z+t*(b.z-a.z)}; return r.normalized(); }
    double th0=std::acos(d), th=th0*t, s0=std::sin(th0), s1=std::sin(th0-th)/s0, s2=std::sin(th)/s0;
    return { a.w*s1+b.w*s2, a.x*s1+b.x*s2, a.y*s1+b.y*s2, a.z*s1+b.z*s2 };
}

struct Mat4 {
    std::array<double, 16> m{};
    double  operator()(int r, int c) const { return m[r * 4 + c]; }
    double& operator()(int r, int c) { return m[r * 4 + c]; }
    static Mat4 identity() { Mat4 r; r(0,0)=r(1,1)=r(2,2)=r(3,3)=1; return r; }
    static Mat4 fromRotTrans(const Mat3& R, const Vec3& p) {
        Mat4 T=identity(); for(int i=0;i<3;++i) for(int j=0;j<3;++j) T(i,j)=R(i,j);
        T(0,3)=p.x; T(1,3)=p.y; T(2,3)=p.z; return T;
    }
    static Mat4 fromRowMajor(const double* a){ Mat4 T; for(int i=0;i<16;++i) T.m[i]=a[i]; return T; }
    Mat3 rot() const { Mat3 R; for(int i=0;i<3;++i) for(int j=0;j<3;++j) R(i,j)=(*this)(i,j); return R; }
    Vec3 pos() const { return {(*this)(0,3),(*this)(1,3),(*this)(2,3)}; }
    Mat4 operator*(const Mat4& b) const {
        Mat4 r; for(int i=0;i<4;++i) for(int j=0;j<4;++j){ double s=0; for(int k=0;k<4;++k) s+=(*this)(i,k)*b(k,j); r(i,j)=s; } return r;
    }
    Mat4 inverseRigid() const { Mat3 Rt=rot().transpose(); Vec3 t=Rt*pos(); return fromRotTrans(Rt,{-t.x,-t.y,-t.z}); }
};

// Solve A x = b for square A (n x n) with partial pivoting. false if singular.
inline bool solveLinearSystem(std::vector<std::vector<double>> A, std::vector<double> b, std::vector<double>& x) {
    const size_t n=b.size(); if (A.size()!=n) return false;
    for (size_t col=0; col<n; ++col){
        size_t piv=col; double best=std::abs(A[col][col]);
        for (size_t r=col+1;r<n;++r) if (std::abs(A[r][col])>best){best=std::abs(A[r][col]);piv=r;}
        if (best<1e-15) return false;
        if (piv!=col){ std::swap(A[piv],A[col]); std::swap(b[piv],b[col]); }
        for (size_t r=col+1;r<n;++r){ double f=A[r][col]/A[col][col]; for(size_t c=col;c<n;++c) A[r][c]-=f*A[col][c]; b[r]-=f*b[col]; }
    }
    x.assign(n,0.0);
    for (size_t i=n;i-->0;){ double s=b[i]; for(size_t c=i+1;c<n;++c) s-=A[i][c]*x[c]; x[i]=s/A[i][i]; }
    return true;
}

}  // namespace erm
