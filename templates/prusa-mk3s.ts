import { KlipperConfigHelper } from '../helpers/klipper-config';
import { PrinterAxis } from '../zods/motion';
import { PrinterConfiguration } from '../zods/printer-configuration';

export const template = (config: PrinterConfiguration, helper: KlipperConfigHelper) => `
# WARNING. THIS FILE IS GENERATED BY THE RATOS CONFIGURATOR.
# CHANGES YOU MAKE HERE WILL BE OVERWRITTEN. KEEP YOUR CHANGES IN PRINTER.CFG.
# Config generated for ${config.printer.manufacturer} ${config.printer.name} ${config.size}
# Documentation: https://os.ratrig.com

#############################################################################################################
### CONTROLBOARD & TOOLBOARD
#############################################################################################################
${helper.renderBoards()}

#############################################################################################################
### BASE SETUP
#############################################################################################################
${helper.renderBase()}
[include RatOS/printers/prusa-mk3s/prusa-mk3s.cfg]
[include RatOS/printers/prusa-mk3s/macros.cfg]

# Extruder
${helper.renderExtruder()}

# Hotend
${helper.renderHotend()}

# ADXL345 resonance testing configuration
${helper.renderInputShaper(200)}

#############################################################################################################
### STEPPER MOTORS, DRIVERS & SPEED LIMITS
#############################################################################################################
${helper.renderStepperSections()}
${helper.renderDriverSections()}
${helper.renderSpeedLimits()}

[bed_mesh]
speed: ${helper.getMacroTravelSpeed()}

[quad_gantry_level]
speed: ${helper.getMacroTravelSpeed()}

#############################################################################################################
### HOMING
#############################################################################################################
${helper.renderProbeIncludes()}
${helper.renderEndstopSection('RatOS/printers/prusa-mk3s/sensorless-homing-tmc2130.cfg')}


#############################################################################################################
### FANS
#############################################################################################################
${helper.renderFans()}

`;

export const initialPrinterCfg = (config: PrinterConfiguration, helper: KlipperConfigHelper) => `
#############################################################################################################
### CONFIGURATION GENERATED BY THE RATOS CONFIGURATOR
#############################################################################################################
[include RatOS.cfg]

#############################################################################################################
### MACRO CONFIGURATION
### Configure the behavior of RatOS macros
### See: https://os.ratrig.com/docs/configuration/macros
#############################################################################################################
[gcode_macro RatOS]
variable_relative_extrusion: False
variable_preheat_extruder: True
variable_calibrate_bed_mesh: True
variable_nozzle_priming: "primeline"
variable_start_print_park_in: "front"
variable_start_print_park_z_height: 50
variable_end_print_park_in: "back"
variable_pause_print_park_in: "front"
variable_filament_unload_length: 100
variable_filament_unload_speed: 5
variable_filament_load_length: 100
variable_filament_load_speed: 10
variable_macro_travel_speed: ${helper.getMacroTravelSpeed()}

#############################################################################################################
### LCD
### Pick your LCD configuration
#############################################################################################################
[include RatOS/printers/prusa-mk3s/display.cfg]

#############################################################################################################
### FILAMENT SENSOR
### Pick your filament sensor configuration
#############################################################################################################
[include RatOS/sensors/prusa-mk3s-filament-switch.cfg]

#############################################################################################################
### FANS
### Pick your fan configuration
#############################################################################################################
[include RatOS/4pin-fans/toolhead-fan-100hz.cfg]
[include RatOS/4pin-fans/part-cooling-fan-100hz.cfg]

#############################################################################################################
### USER OVERRIDES & CUSTOM CONFIGURATION
### Anything custom you want to add, or RatOS configuration you want to override, do it here.
### This section is pre-populated with the most common settings you may want to change.
### See: https://os.ratrig.com/docs/configuration/includes-and-overrides
###
### It is recommended that you follow these steps to properly calibrate your printer:
### 0) Sanity check and PID Tuning: https://www.klipper3d.org/Config_checks.html
### 1) Pressure Advance: https://www.klipper3d.org/Pressure_Advance.html
### 2) Skew Correction: https://www.klipper3d.org/Skew_Correction.html
### 3) Resonance Compensation: https://www.klipper3d.org/Resonance_Compensation.html
### RatOS has dedicated macro's to generate shaper graphs for deeper analysis (requires accelerometer).
### Use MEASURE_COREXY_BELT_TENSION to compare tension between belts, and use
### GENERATE_SHAPER_GRAPHS to generate the resonance graphs for analysing and manually entering input shaper
### configuration.
### You can run SHAPER_CALIBRATE to automatically calibrate your input shaper configuration, if you just want
### to get started.
### Read more about klipper here: https://www.klipper3d.org/Overview.html
#############################################################################################################

[stepper_x]
dir_pin: !x_dir_pin # Add ! in front of pin name to reverse X stepper direction

[stepper_y]
dir_pin: y_dir_pin # Add ! in front of pin name to reverse Y stepper direction

[stepper_z]
dir_pin: !z0_dir_pin # Remove ! in front of pin name to reverse Z stepper direction

# Pressure Advance
# Check https://www.klipper3d.org/Pressure_Advance.html for pressure advance tuning.
[extruder]
pressure_advance: 0.04 #this is a reference value, should be calibrated on each printer
dir_pin: ${helper.getExtruderPinPrefix()}e_dir_pin # Remove ! in front of pin name to reverse extruder direction
nozzle_diameter: 0.4 # Remember to change this if you change nozzle diameter.
control: pid
pid_Kp: 16.13
pid_Ki: 1.1625
pid_Kd: 56.23

[heater_bed]
control: pid
pid_Kp: 126.13
pid_Ki: 4.3
pid_Kd: 924.76

[pause_resume]
recover_velocity: 50.

[stepper_z]
position_max: 214

[probe]
x_offset: 24
y_offset: 5

${helper.renderProbePinSection()}

${helper.renderReminders()}
`;
