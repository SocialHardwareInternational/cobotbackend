// test_fk.cpp -- verify DH-based C++ FK against the URDF, and the Jacobian.
// Prints FK[:3,:4] for fixed configs (compared to the NumPy URDF oracle in
// test/urdf_fk_oracle.py), then runs internal Jacobian / orthonormality checks.
#include <cmath>
#include <cstdio>
#include <random>
#include "erm/kinematics.hpp"
using namespace erm;

static const JVec CFG[] = {
    {0,0,0,0,0,0},
    {0.5,-0.3,0.8,-0.4,0.6,-0.2},
    {1.2,0.7,-1.1,0.9,-0.5,1.3},
    {-2.0,1.5,2.5,-1.8,0.3,-2.2},
    {3.0,-3.0,3.0,-3.0,3.0,-3.0},
    {0.1,0.2,0.3,0.4,0.5,0.6},
};

int main(int argc, char** argv) {
    if (argc > 1 && std::string(argv[1]) == "--fk") {
        // machine-readable: 12 numbers (FK[:3,:4] row-major) per config
        for (auto& q : CFG) {
            Mat4 T = forwardKinematics(q);
            for (int r=0;r<3;++r) for (int c=0;c<4;++c) std::printf("%.12f ", T(r,c));
            std::printf("\n");
        }
        return 0;
    }
    int fail = 0;
    std::mt19937 rng(2026);
    std::uniform_real_distribution<double> U(-3.0, 3.0);

    // orthonormality
    double maxOrtho=0;
    for (int t=0;t<200;++t){ JVec q; for(int i=0;i<NJ;++i) q[i]=U(rng);
        Mat3 R=forwardKinematics(q).rot(); Mat3 I=R*R.transpose();
        for (int r=0;r<3;++r) for(int c=0;c<3;++c) maxOrtho=std::max(maxOrtho,std::abs(I(r,c)-(r==c?1.0:0.0)));
    }
    std::printf("[1] FK orthonormality max dev %.2e %s\n", maxOrtho, maxOrtho<1e-9?"ok":"FAIL");
    fail += maxOrtho<1e-9?0:1;

    // Jacobian vs central finite differences
    double worst=0; const double eps=1e-6;
    for (int t=0;t<50;++t){ JVec q; for(int i=0;i<NJ;++i) q[i]=U(rng)*0.8;
        Vec3 ref=forwardKinematics(q).pos(); auto J=jacobianAt(q,ref);
        for (int i=0;i<NJ;++i){ JVec qp=q,qm=q; qp[i]+=eps; qm[i]-=eps;
            Mat4 Tp=forwardKinematics(qp),Tm=forwardKinematics(qm);
            Vec3 dp=(Tp.pos()-Tm.pos())*(1.0/(2*eps));
            Vec3 w=mat3ToRotVec(Tp.rot()*Tm.rot().transpose())*(1.0/(2*eps));
            worst=std::max(worst,std::abs(dp.x-J[0][i])); worst=std::max(worst,std::abs(dp.y-J[1][i])); worst=std::max(worst,std::abs(dp.z-J[2][i]));
            worst=std::max(worst,std::abs(w.x-J[3][i])); worst=std::max(worst,std::abs(w.y-J[4][i])); worst=std::max(worst,std::abs(w.z-J[5][i]));
        }
    }
    std::printf("[2] Jacobian vs finite-diff max err %.2e %s\n", worst, worst<1e-4?"ok":"FAIL");
    fail += worst<1e-4?0:1;

    std::printf("%s\n", fail?"TESTS FAILED":"FK/JACOBIAN OK");
    return fail?1:0;
}
