// erm/hal.hpp -- EtherCAT Hardware Abstraction Layer (Cyclic Synchronous Position).
//
// The control node calls cycle() once per 1 kHz tick with the commanded joint
// positions; the HAL exchanges PDOs with the drives and returns measured state.
// To target real hardware, implement EthercatInterface against your master
// (SOEM ec_send/receive_processdata, or IgH EtherLab) mapping CSP target /
// actual position PDOs -- nothing above the HAL changes.
//
// SimDrives is an ideal CSP follower (drives track the commanded setpoint) with
// the e-stop interlock and joint-limit clamping, so the stack runs without hardware.
#pragma once
#include <algorithm>
#include <array>
#include "erm/erobo10_dh.hpp"

namespace erm {

using JArr = std::array<double, NJ>;

class EthercatInterface {
   public:
    virtual ~EthercatInterface() = default;
    virtual bool enable() = 0;
    virtual void disable() = 0;
    virtual void estop() = 0;
    virtual void resetEstop() = 0;
    virtual bool isEstopped() const = 0;
    virtual bool isEnabled() const = 0;
    // One CSP cycle: send q_cmd, return measured q_act / qd_act for dt seconds.
    virtual void cycle(const JArr& q_cmd, JArr& q_act, JArr& qd_act, double dt) = 0;
    virtual JArr position() const = 0;
    // Free-drive / hand-guide (real drives only). Sim ignores it (no hand to guide).
    virtual void setFreedrive(bool /*on*/) {}
};

// Default home pose: a comfortable, non-singular configuration.
inline JArr homePose() { return {0.0, 0.6, -1.2, 0.0, 0.9, 0.0}; }

class SimDrives : public EthercatInterface {
   public:
    explicit SimDrives(const JArr& q0 = homePose()) : q_(q0), prev_(q0) {}
    bool enable() override { enabled_ = true; return true; }
    void disable() override { enabled_ = false; }
    void estop() override { estopped_ = true; }
    void resetEstop() override { estopped_ = false; }
    bool isEstopped() const override { return estopped_; }
    bool isEnabled() const override { return enabled_; }

    void cycle(const JArr& q_cmd, JArr& q_act, JArr& qd_act, double dt) override {
        const double* lo = jointLower(); const double* hi = jointUpper();
        if (!enabled_ || estopped_) {
            qd_act.fill(0.0); q_act = q_; prev_ = q_; return;   // hold position
        }
        for (int i = 0; i < NJ; ++i) {
            double c = std::min(std::max(q_cmd[i], lo[i]), hi[i]);
            qd_act[i] = (c - q_[i]) / dt;     // velocity from the commanded step
            prev_[i] = q_[i];
            q_[i] = c;                         // ideal CSP tracking
        }
        q_act = q_;
    }
    JArr position() const override { return q_; }
    void setJoints(const JArr& q) { q_ = q; prev_ = q; }

   private:
    JArr q_{}, prev_{};
    bool enabled_ = true, estopped_ = false;
};

}  // namespace erm
