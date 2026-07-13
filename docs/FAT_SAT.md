# eRoBo 10 — Factory / Site Acceptance Test Procedures

Record results with software version (`/api/v1/system`), date, and signatures.

## FAT (factory, simulator or hardware)
1. `make test` — 4 unit suites pass (FK/Jacobian, IK 3000-pose, trajectory limits, safety monitor).
2. `python3 test/integration_test.py` — 40+ end-to-end checks pass.
3. Studio build: `cd studio && npm run build` completes; UI loads at :8080.
4. E-stop: engage during a MoveL — drives drop < 1 control cycle; recovery per manual.
5. Speed override 10 % → 100 % during motion — no discontinuity.
6. Safety plane: configure at TCP height − 50 mm; command through it → rejected;
   jog toward it → decelerates to stop at boundary.

## SAT (site, hardware)
1. Hardware E-stop chain drops all six drives (measure < 50 ms to STO).
2. Joint direction + zero verification against the 3-D model, all joints.
3. Repeatability: 30× return to a taught pose, dial indicator at TCP —
   spec ±0.05 mm (encoder resolution 2^19/rev supports this; record actual).
4. Payload test at rated 10 kg: gravity hold, MoveJ/MoveL cycle, torque
   utilisation < 90 % on Diagnostics.
5. Contact test at 250 mm/s reduced speed against a padded fixture — protective
   stop, force within configured limit.
6. 1 h soak: looped production program; zero overruns growth, temperatures
   plateau < 70 °C, no alarms.
7. PLC handshake (if used): Modbus start/stop/speed + DI/DO exchange verified.
8. Backup taken and restore verified on the spare controller image.
