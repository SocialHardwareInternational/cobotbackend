// erm/shm.hpp -- POSIX shared-memory mapping + seqlock helpers.
#pragma once
#include <fcntl.h>
#include <sys/mman.h>
#include <sys/stat.h>
#include <unistd.h>
#include <cerrno>

#include <atomic>
#include <cstring>
#include <functional>
#include <stdexcept>
#include <string>
#include "erm/shm_layout.hpp"

namespace erm {

constexpr const char* DEFAULT_SHM_PATH = "/dev/shm/erobo10_shm";

inline ShmBlock* shmMap(const std::string& path, bool& created) {
    ::umask(0);                                   // do not let umask strip the 0666 bits
    int fd = ::open(path.c_str(), O_RDWR | O_CREAT, 0666);
    if (fd < 0) throw std::runtime_error("shm open failed: " + path + " (" + std::strerror(errno) + ")");
    ::fchmod(fd, 0666);                            // shared by root (EtherCAT) + user (planner/ik/bridge)
    struct stat sb{};
    if (::fstat(fd, &sb) != 0) { ::close(fd); throw std::runtime_error("fstat failed"); }
    created = (sb.st_size < (off_t)sizeof(ShmBlock));
    if (::ftruncate(fd, sizeof(ShmBlock)) != 0) { ::close(fd); throw std::runtime_error("ftruncate failed"); }
    void* p = ::mmap(nullptr, sizeof(ShmBlock), PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    ::close(fd);
    if (p == MAP_FAILED) throw std::runtime_error("mmap failed");
    return reinterpret_cast<ShmBlock*>(p);
}
inline void shmUnmap(ShmBlock* p) { if (p) ::munmap(p, sizeof(ShmBlock)); }

// Seqlock write: bump to odd, fence, write via fn(), fence, bump to even.
template <class Fn>
inline void seqWrite(uint32_t& seq, Fn&& fn) {
    seq |= 1u;
    std::atomic_thread_fence(std::memory_order_release);
    fn();
    std::atomic_thread_fence(std::memory_order_release);
    seq += 1u;
}
// Seqlock read: retry until a stable even snapshot. fn() copies the fields out.
template <class Fn>
inline bool seqRead(const uint32_t& seq, Fn&& fn, int retries = 64) {
    for (int i = 0; i < retries; ++i) {
        uint32_t s1 = seq;
        if (s1 & 1u) continue;
        std::atomic_thread_fence(std::memory_order_acquire);
        fn();
        std::atomic_thread_fence(std::memory_order_acquire);
        uint32_t s2 = seq;
        if (s1 == s2) return true;
    }
    return false;
}

inline void setCStr(char* dst, size_t n, const std::string& s) {
    std::memset(dst, 0, n);
    std::strncpy(dst, s.c_str(), n - 1);
}

}  // namespace erm
