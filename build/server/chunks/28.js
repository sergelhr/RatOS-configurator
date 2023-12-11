"use strict";
exports.id = 28;
exports.ids = [28];
exports.modules = {

/***/ 1028:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "initialPrinterCfg": () => (/* binding */ initialPrinterCfg),
/* harmony export */   "template": () => (/* binding */ template)
/* harmony export */ });
/* harmony import */ var _zods_motion__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6680);

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
[include RatOS/printers/v-core-3/v-core-3.cfg]
[include RatOS/printers/v-core-3/macros.cfg]
[include RatOS/printers/v-core-3/${config.size ?? 300}.cfg]

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

[z_tilt]
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
variable_start_print_park_in: "back"
variable_start_print_park_z_height: 50
variable_end_print_park_in: "back"
variable_pause_print_park_in: "back"
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
dir_pin: x_dir_pin # Add ! in front of pin name to reverse X stepper direction
rotation_distance: ${helper.getRail(_zods_motion__WEBPACK_IMPORTED_MODULE_0__/* .PrinterAxis.x */ .po.x).rotationDistance} # 40 for 20 tooth 2GT pulleys, 32 for 16 tooth 2GT pulleys

[stepper_y]
dir_pin: y_dir_pin # Add ! in front of pin name to reverse Y stepper direction
rotation_distance: ${helper.getRail(_zods_motion__WEBPACK_IMPORTED_MODULE_0__/* .PrinterAxis.y */ .po.y).rotationDistance} # 40 for 20 tooth 2GT pulleys, 32 for 16 tooth 2GT pulleys

[stepper_z]
dir_pin: !z0_dir_pin # Add ! in front of pin name to reverse Z stepper direction
rotation_distance: ${helper.getRail(_zods_motion__WEBPACK_IMPORTED_MODULE_0__/* .PrinterAxis.z */ .po.z).rotationDistance} # 4 for TR8*4 lead screws

[stepper_z1]
dir_pin: !z1_dir_pin # Add ! in front of pin name to reverse Z1 direction
rotation_distance: ${helper.getRail(_zods_motion__WEBPACK_IMPORTED_MODULE_0__/* .PrinterAxis.z1 */ .po.z1).rotationDistance} # 4 for TR8*4 lead screws

[stepper_z2]
dir_pin: !z2_dir_pin # Add ! in front of pin name to reverse Z2 direction
rotation_distance: ${helper.getRail(_zods_motion__WEBPACK_IMPORTED_MODULE_0__/* .PrinterAxis.z2 */ .po.z2).rotationDistance} # 4 for TR8*4 lead screws

[extruder]
#pressure_advance: 0.05 # Check https://www.klipper3d.org/Pressure_Advance.html for pressure advance tuning.
nozzle_diameter: 0.4 # Remember to change this if you change nozzle diameter.
dir_pin: !${helper.getExtruderPinPrefix()}e_dir_pin # Remove ! in front of pin name to reverse extruder direction
control: pid
pid_kp: 28.413
pid_ki: 1.334
pid_kd: 151.300

[heater_bed]
control: pid
pid_Kp: 22.2
pid_Ki: 1.08
pid_Kd: 114

${helper.renderProbePinSection()}

${helper.renderReminders()}
`;


/***/ })

};
;