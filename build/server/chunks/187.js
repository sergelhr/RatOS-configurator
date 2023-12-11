"use strict";
exports.id = 187;
exports.ids = [187];
exports.modules = {

/***/ 3187:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initialPrinterCfg": () => (/* binding */ initialPrinterCfg),
/* harmony export */   "template": () => (/* binding */ template)
/* harmony export */ });
const template = (config, helper)=>`
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
[include RatOS/printers/voron-v24/voron-v24.cfg]
[include RatOS/printers/voron-v24/macros.cfg]
[include RatOS/printers/voron-v24/${config.size ?? 300}.cfg]

# Extruder
${helper.renderExtruder()}

# Hotend
${helper.renderHotend()}

# ADXL345 resonance testing configuration
${helper.renderInputShaper(config.size ?? 300)}

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
${helper.renderEndstopSection()}


#############################################################################################################
### FANS
#############################################################################################################
${helper.renderFans()}

`;
const initialPrinterCfg = (config, helper)=>`
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
variable_nozzle_priming: "primeblob"
variable_start_print_park_in: "front"
variable_start_print_park_z_height: 50
variable_end_print_park_in: "back"
variable_pause_print_park_in: "front"
variable_macro_travel_speed: ${helper.getMacroTravelSpeed()}

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
dir_pin: !x_dir_pin # Remove ! in front of pin name to reverse X stepper direction

[stepper_y]
dir_pin: y_dir_pin # Add ! in front of pin name to reverse Y stepper direction

[stepper_z]
dir_pin: !z0_dir_pin # Remove ! in front of pin name to reverse Z stepper direction

[stepper_z1]
dir_pin: !z1_dir_pin # Remove ! in front of pin name to reverse Z stepper direction

[stepper_z2]
dir_pin: !z2_dir_pin # Remove ! in front of pin name to reverse Z stepper direction

[stepper_z3]
dir_pin: !z3_dir_pin # Remove ! in front of pin name to reverse Z stepper direction

# Pressure Advance
# Check https://www.klipper3d.org/Pressure_Advance.html for pressure advance tuning.
[extruder]
# pressure_advance: 0.05
dir_pin: !${helper.getExtruderPinPrefix()}e_dir_pin # Remove ! in front of pin name to reverse extruder direction
nozzle_diameter: 0.4 # Remember to change this if you change nozzle diameter.
control: pid
pid_kp: 21.673
pid_ki: 1.338
pid_kd: 87.776

[heater_bed]
control: pid
pid_kp: 68.203
pid_ki: 2.842
pid_kd: 409.216

${helper.renderProbePinSection()}

${helper.renderReminders()}
`;


/***/ })

};
;