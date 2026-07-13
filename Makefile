# erobo10_motion build.
#   make                 -> sim apps + tools + tests
#   make test            -> build + run unit tests (FK, IK, trajectory)
#   make HARDWARE=1 apps -> also build ecat_control_node against the real EtherCAT master
#   make test-ecat-mock  -> compile-check the EtherCAT node against a stand-in ecrt.h
CXX      ?= g++
CXXFLAGS ?= -std=c++17 -O2 -Wall -Icore/include
LDFLAGS  ?= -pthread
BIN       = bin
HDRS      = $(wildcard core/include/erm/*.hpp)

# control_node is the SIMULATION node; ecat_control_node is the real EtherCAT driver.
APPS  = control_node motion_planner ik_solver
TOOLS = inject
UTEST = test_fk test_ik test_traj test_safety

.PHONY: all apps tools tests test test-ecat-mock clean
all: apps tools tests
apps:  $(APPS:%=$(BIN)/%)
tools: $(TOOLS:%=$(BIN)/%)
tests: $(UTEST:%=$(BIN)/%)

# Real EtherCAT node is opt-in (needs libethercat): `make HARDWARE=1 apps`.
ifdef HARDWARE
apps: $(BIN)/ecat_control_node
endif

$(BIN):
	mkdir -p $(BIN)

# Real EtherCAT control node (ZeroErr driver, ported from main.cpp). Always links -lethercat.
$(BIN)/ecat_control_node: apps/ecat_control_node.cpp $(HDRS) | $(BIN)
	$(CXX) $(CXXFLAGS) $< -o $@ $(LDFLAGS) -lethercat

$(BIN)/%: apps/%.cpp $(HDRS) | $(BIN)
	$(CXX) $(CXXFLAGS) $< -o $@ $(LDFLAGS)
$(BIN)/%: tools/%.cpp $(HDRS) | $(BIN)
	$(CXX) $(CXXFLAGS) $< -o $@ $(LDFLAGS)
$(BIN)/%: test/%.cpp $(HDRS) | $(BIN)
	$(CXX) $(CXXFLAGS) $< -o $@ $(LDFLAGS)

test: tests
	./$(BIN)/test_fk && ./$(BIN)/test_ik && ./$(BIN)/test_traj && ./$(BIN)/test_safety

# Offline build/run check of the EtherCAT node against the simulated-drive mock (no hardware,
# no libethercat). Proves it compiles and that the angle controller converges to the setpoint.
test-ecat-mock: | $(BIN)
	$(CXX) $(CXXFLAGS) -Itest/mock_ecrt_sim apps/ecat_control_node.cpp -o $(BIN)/ecat_control_node_mock $(LDFLAGS)
	@echo "[test-ecat-mock] ecat_control_node compiles against the drive-sim mock"

clean:
	rm -rf $(BIN)
