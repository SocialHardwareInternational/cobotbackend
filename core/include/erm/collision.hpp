// erm/collision.hpp -- approximate self-collision proximity for the erobo10 arm.
//
// Each link is a SPHERE CLOUD: surface points sampled from the real corrected-URDF meshes (in
// each link frame), each with a covering radius so the spheres tile the link (erobo10_collision_
// geom.hpp). selfCollision(q) transforms the points to the base frame and returns the smallest
// signed clearance between any pair of NON-ADJACENT links:
//   clearance(i,j) = min|p_i - p_j| - skin_i - skin_j ;  <=0 means the envelopes overlap.
//
// Replaces the old one-capsule-per-link model, which mis-fired on this arm: some links pass
// structurally close (upper arm ~23 mm from the base; wrist links ~10-15 mm) so a fat central
// capsule reported a CONSTANT false collision at every pose. Those mechanically-constrained
// pairs are excluded; everything else is checked accurately. Software EARLY-WARNING only -- NOT
// a substitute for the hardware E-stop / STO.
#pragma once
#include <cmath>
#include "erm/kinematics.hpp"
#include "erm/erobo10_collision_geom.hpp"

namespace erm {

struct CollisionResult { double dist; int i; int j; };   // i,j = link indices (0 base .. 6 link6)
inline const char* const* collisionNames() {
    static const char* N[7] = {"base", "link1", "link2", "link3", "link4", "link5", "link6"};
    return N;
}

// Excluded pairs: adjacent links share a joint; these non-adjacent pairs are mechanically
// constrained to stay close at EVERY pose, so they cannot actually collide:
//   (0,2) upper arm <-> base column ; (3,5) and (4,6) wrist-internal links.
inline bool collisionExcluded(int i, int j) {
    if (j <= i + 1) return true;
    if (i == 0 && j == 2) return true;
    if (i == 3 && j == 5) return true;
    if (i == 4 && j == 6) return true;
    return false;
}

inline CollisionResult selfCollision(const JVec& q) {
    auto F = linkFrames(q);                              // F[0..6] = base..link6
    const double (*P)[NPT][3] = collisionPts();
    const double* SK = collisionSkin();
    static thread_local double W[NLINK][NPT][3];
    for (int k = 0; k < NLINK; ++k) {
        const Mat4& T = F[k];
        for (int p = 0; p < NPT; ++p) {
            double x = P[k][p][0], y = P[k][p][1], z = P[k][p][2];
            W[k][p][0] = T(0,0)*x + T(0,1)*y + T(0,2)*z + T(0,3);
            W[k][p][1] = T(1,0)*x + T(1,1)*y + T(1,2)*z + T(1,3);
            W[k][p][2] = T(2,0)*x + T(2,1)*y + T(2,2)*z + T(2,3);
        }
    }
    CollisionResult best{1e9, -1, -1};
    for (int i = 0; i < NLINK; ++i)
        for (int j = i + 2; j < NLINK; ++j) {
            if (collisionExcluded(i, j)) continue;
            double d2min = 1e18;
            for (int a = 0; a < NPT; ++a) {
                const double* pa = W[i][a];
                for (int b = 0; b < NPT; ++b) {
                    const double* pb = W[j][b];
                    double dx = pa[0]-pb[0], dy = pa[1]-pb[1], dz = pa[2]-pb[2];
                    double d2 = dx*dx + dy*dy + dz*dz;
                    if (d2 < d2min) d2min = d2;
                }
            }
            double d = std::sqrt(d2min) - SK[i] - SK[j];
            if (d < best.dist) { best.dist = d; best.i = i; best.j = j; }
        }
    return best;
}

}  // namespace erm
