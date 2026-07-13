// test_ik.cpp -- FK-oracle validation of the IK solver on the real erobo10.
#include <cmath>
#include <cstdio>
#include <random>
#include "erm/ik.hpp"
using namespace erm;

int main() {
    std::mt19937 rng(99);
    const double* lo=jointLower(); const double* hi=jointUpper();
    auto randQ=[&](double margin){ JVec q; for(int i=0;i<NJ;++i){ std::uniform_real_distribution<double> U(lo[i]+margin,hi[i]-margin); q[i]=U(rng);} return q; };

    // ---- 1. COLD solve (seed = zeros): global reliability ----
    int N=3000, okc=0; double worstP=0, worstO=0; long iters=0, seeds=0;
    for (int t=0;t<N;++t){
        JVec qt=randQ(0.05); Mat4 target=forwardKinematics(qt);
        JVec seed{0,0,0,0,0,0};
        IkResult r=solveIK(target, seed);
        if (r.ok){ okc++; worstP=std::max(worstP,r.pos_err); worstO=std::max(worstO,r.ori_err); iters+=r.iters; seeds+=r.seeds_used; }
    }
    std::printf("[1] COLD IK: %d/%d converged (%.2f%%); worst pos %.2e m, ori %.2e rad; avg iters %.0f, avg seeds %.1f\n",
                okc,N,100.0*okc/N,worstP,worstO,(double)iters/std::max(1,okc),(double)seeds/std::max(1,okc));

    // ---- 2. WARM solve (seed near truth): continuity branch ----
    int okw=0; double worstPw=0; std::normal_distribution<double> Nz(0,0.05);
    for (int t=0;t<N;++t){
        JVec qt=randQ(0.05); Mat4 target=forwardKinematics(qt);
        JVec seed=qt; for(int i=0;i<NJ;++i) seed[i]+=Nz(rng);
        IkResult r=solveIK(target, seed);
        if (r.ok){ okw++; worstPw=std::max(worstPw,r.pos_err);
            // returned solution should be near the seed (no flip)
        }
    }
    std::printf("[2] WARM IK: %d/%d converged (%.2f%%); worst pos %.2e m\n", okw,N,100.0*okw/N,worstPw);

    // ---- 3. Cartesian continuity: walk a straight line, warm-start chain ----
    JVec q=randQ(0.3); Mat4 p0=forwardKinematics(q);
    Vec3 start=p0.pos(); Mat3 R=p0.rot();
    double maxJump=0; bool allok=true; JVec prev=q;
    for (int k=0;k<=100;++k){
        double s=k/100.0;
        Mat4 target=Mat4::fromRotTrans(R, {start.x+0.15*s, start.y-0.10*s, start.z+0.05*s});
        IkResult r=solveIK(target, prev);
        if (!r.ok){ allok=false; break; }
        double jump=0; for(int i=0;i<NJ;++i) jump=std::max(jump,std::abs(r.q[i]-prev[i]));
        maxJump=std::max(maxJump,jump); prev=r.q;
    }
    std::printf("[3] Cartesian-line continuity: %s; max joint step between 1.5mm waypoints = %.4f rad\n",
                allok?"all solved":"FAILED", maxJump);

    bool pass = okc==N && okw==N && allok && worstP<1e-5 && worstO<1e-5 && maxJump<0.1;
    std::printf("\n%s\n", pass?"IK OK (no-fail + precise + continuous)":"IK ISSUES");
    return pass?0:1;
}
