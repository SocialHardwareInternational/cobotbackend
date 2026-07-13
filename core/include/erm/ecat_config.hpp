// erm/ecat_config.hpp -- REMOVED.
//
// The EtherCAT configuration is no longer a separate header. The few tunables (vendor/
// product IDs, ENCODER_RES, the angle-mode gains, brake polarity) now live at the top of
//   apps/ecat_control_node.cpp   (the ZeroErr driver, ported from your main.cpp).
// Nothing includes this file anymore; it is kept empty only until it is deleted.
#pragma once
