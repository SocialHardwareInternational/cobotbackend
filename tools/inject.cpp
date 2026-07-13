// inject.cpp -- command injector + motion monitor (stands in for the WebSocket
// bridge during testing). Writes a goal to shared memory, watches state, reports
// final pose error and motion smoothness.
//
//   inject movejoint q1 q2 q3 q4 q5 q6 [--speed s]
//   inject ptp  x y z qw qx qy qz       [--speed s]
//   inject lin  x y z qw qx qy qz       [--speed s]
//   inject stop
#include <chrono>
#include <cmath>
#include <cstdio>
#include <cstring>
#include <string>
#include <thread>
#include <vector>
#include "erm/kinematics.hpp"
#include "erm/shm.hpp"
using namespace erm;

int main(int argc, char** argv) {
    std::string path=DEFAULT_SHM_PATH; double speed=1.0;
    std::vector<std::string> a; for(int i=1;i<argc;++i) a.push_back(argv[i]);
    for (size_t i=0;i<a.size();++i) if (a[i]=="--speed"&&i+1<a.size()) speed=std::stod(a[i+1]);
    if (a.empty()){ std::printf("usage: inject movejoint|ptp|lin|stop ...\n"); return 2; }
    bool created=false; ShmBlock* blk=shmMap(path,created);
    if (blk->magic!=SHM_MAGIC){ std::fprintf(stderr,"shm not ready -- start control_node first\n"); return 1; }

    uint32_t type=0; double tq[SJ]={0}, tp[7]={0}; bool havePose=false;
    if (a[0]=="movejoint"){ type=CMD_MOVE_JOINT; for(int i=0;i<SJ;++i) tq[i]=std::stod(a[1+i]); }
    else if (a[0]=="ptp"||a[0]=="lin"){ type=(a[0]=="ptp")?CMD_MOVE_PTP:CMD_MOVE_LIN; for(int i=0;i<7;++i) tp[i]=std::stod(a[1+i]); havePose=true; }
    else if (a[0]=="stop"){ type=CMD_STOP; }
    else { std::fprintf(stderr,"unknown subcommand\n"); return 2; }

    seqWrite(blk->cmd.cmd_seq, [&]{
        CmdRegion& c=blk->cmd; c.type=type; c.speed=speed;
        for(int i=0;i<SJ;++i) c.target_q[i]=tq[i];
        for(int i=0;i<7;++i) c.target_pose[i]=tp[i];
    });
    std::printf("[inject] sent %s (cmd#%u, speed %.2f)\n", a[0].c_str(), blk->cmd.cmd_seq, speed);
    if (type==CMD_STOP) return 0;

    // monitor
    auto t0=std::chrono::steady_clock::now();
    JVec prevq{}; bool first=true; double maxStep=0; bool started=false; int idleStreak=0;
    Vec3 tppos{tp[0],tp[1],tp[2]};
    while (true) {
        StateRegion s{}; seqRead(blk->st.state_seq,[&]{ s=blk->st; });
        JVec q; for(int i=0;i<SJ;++i) q[i]=s.q[i];
        if(!first){ double st=0; for(int i=0;i<SJ;++i) st=std::max(st,std::abs(q[i]-prevq[i])); maxStep=std::max(maxStep,st); }
        prevq=q; first=false;
        if (s.mode==MODE_MOVING) started=true;
        if (started && s.mode!=MODE_MOVING){ if(++idleStreak>40) break; } else idleStreak=0;
        if (std::chrono::duration<double>(std::chrono::steady_clock::now()-t0).count()>20.0){ std::printf("[inject] timeout\n"); break; }
        std::this_thread::sleep_for(std::chrono::milliseconds(5));
    }
    StateRegion s{}; seqRead(blk->st.state_seq,[&]{ s=blk->st; });
    std::printf("[inject] done. flange pos = [%.4f %.4f %.4f]\n", s.flange_pos[0],s.flange_pos[1],s.flange_pos[2]);
    std::printf("[inject] max joint step between 5ms samples = %.5f rad (smoothness)\n", maxStep);
    if (havePose){ Vec3 fp{s.flange_pos[0],s.flange_pos[1],s.flange_pos[2]}; double pe=norm(fp-tppos);
        std::printf("[inject] target pos err = %.3e m %s\n", pe, pe<1e-3?"OK":"(check reachability)"); }
    if (type==CMD_MOVE_JOINT){ double je=0; for(int i=0;i<SJ;++i) je=std::max(je,std::abs(s.q[i]-tq[i]));
        std::printf("[inject] joint target err = %.3e rad %s\n", je, je<1e-4?"OK":"FAIL"); }
    return 0;
}
