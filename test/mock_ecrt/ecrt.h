// MOCK ecrt.h -- minimal IgH/EtherLab EtherCAT master API surface, for COMPILE-TESTING
// erm/ecat_hal.hpp without real hardware or the libethercat headers. It mirrors the
// types/signatures/macros used by the backend so the compiler type-checks the entire
// EtherCAT path. NOT a functional master -- never use on real hardware.
#pragma once
#include <cstdint>
#include <cstddef>

#define EC_END (~0U)

typedef struct ec_master_t       ec_master_t;
typedef struct ec_domain_t       ec_domain_t;
typedef struct ec_slave_config_t ec_slave_config_t;

typedef enum { EC_DIR_INVALID, EC_DIR_OUTPUT, EC_DIR_INPUT, EC_DIR_BOTH } ec_direction_t;
typedef enum { EC_WD_DEFAULT, EC_WD_ENABLE, EC_WD_DISABLE } ec_watchdog_mode_t;

typedef struct { uint16_t index; uint8_t subindex; uint8_t bit_length; } ec_pdo_entry_info_t;
typedef struct { uint16_t index; unsigned int n_entries; ec_pdo_entry_info_t* entries; } ec_pdo_info_t;
typedef struct {
    uint8_t index; ec_direction_t dir; unsigned int n_pdos;
    ec_pdo_info_t* pdos; ec_watchdog_mode_t watchdog_mode;
} ec_sync_info_t;
typedef struct {
    uint16_t alias; uint16_t position; uint32_t vendor_id; uint32_t product_code;
    uint16_t index; uint8_t subindex; unsigned int* offset; unsigned int* bit_position;
} ec_pdo_entry_reg_t;

// --- unaligned LE access macros (mock: plain pointer access; fine for a contiguous buf) ---
#define EC_READ_U16(DATA)        (*(uint16_t*)(DATA))
#define EC_READ_S32(DATA)        (*(int32_t*)(DATA))
#define EC_WRITE_U16(DATA, VAL)  do { *(uint16_t*)(DATA) = (uint16_t)(VAL); } while (0)
#define EC_WRITE_U32(DATA, VAL)  do { *(uint32_t*)(DATA) = (uint32_t)(VAL); } while (0)
#define EC_WRITE_S32(DATA, VAL)  do { *(int32_t*)(DATA)  = (int32_t)(VAL);  } while (0)

static uint8_t _mock_pd[1024];
static int     _mock_obj;

static inline ec_master_t* ecrt_request_master(unsigned int) { return (ec_master_t*)&_mock_obj; }
static inline void ecrt_release_master(ec_master_t*) {}
static inline ec_slave_config_t* ecrt_master_slave_config(ec_master_t*, uint16_t, uint16_t,
                                                          uint32_t, uint32_t) { return (ec_slave_config_t*)&_mock_obj; }
static inline int  ecrt_slave_config_sdo8(ec_slave_config_t*, uint16_t, uint8_t, uint8_t) { return 0; }
static inline int  ecrt_slave_config_pdos(ec_slave_config_t*, unsigned int, const ec_sync_info_t*) { return 0; }
static inline int  ecrt_slave_config_dc(ec_slave_config_t*, uint16_t, uint32_t, int32_t, uint32_t, int32_t) { return 0; }
static inline ec_domain_t* ecrt_master_create_domain(ec_master_t*) { return (ec_domain_t*)&_mock_obj; }
static inline int  ecrt_domain_reg_pdo_entry_list(ec_domain_t*, const ec_pdo_entry_reg_t*) { return 0; }
static inline int  ecrt_master_activate(ec_master_t*) { return 0; }
static inline uint8_t* ecrt_domain_data(ec_domain_t*) { return _mock_pd; }
static inline void ecrt_master_receive(ec_master_t*) {}
static inline void ecrt_domain_process(ec_domain_t*) {}
static inline void ecrt_domain_queue(ec_domain_t*) {}
static inline void ecrt_master_send(ec_master_t*) {}
static inline void ecrt_master_application_time(ec_master_t*, uint64_t) {}
static inline void ecrt_master_sync_reference_clock(ec_master_t*) {}
static inline void ecrt_master_sync_slave_clocks(ec_master_t*) {}
