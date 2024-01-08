"use strict";
exports.id = 313;
exports.ids = [313];
exports.modules = {

/***/ 9313:
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
[include RatOS/printers/prusa-mini/prusa-mini.cfg]
[include RatOS/printers/prusa-mini/macros.cfg]

# Extruder
${helper.renderExtruder()}

# Hotend
${helper.renderHotend()}

# ADXL345 resonance testing configuration
${helper.renderInputShaper(180)}

#############################################################################################################
### STEPPER MOTORS, DRIVERS & SPEED LIMITS
#############################################################################################################
${helper.renderMotorSections()}
${helper.renderSpeedLimits()}

[bed_mesh]
speed: ${helper.getMacroTravelSpeed()}

[quad_gantry_level]
speed: ${helper.getMacroTravelSpeed()}

#############################################################################################################
### HOMING
#############################################################################################################
${helper.renderProbeIncludes()}
${helper.renderEndstopSection("RatOS/printers/prusa-mini/sensorless-homing-tmc2209.cfg")}


#############################################################################################################
### FANS
#############################################################################################################
${helper.renderFans()}

#############################################################################################################
### MACRO CONFIGURATION
#############################################################################################################

# Macro variable overrides
[gcode_macro RatOS]
${helper.renderMacroVariableOverrides()}
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
variable_nozzle_priming: "primeline"
variable_start_print_park_in: "front"
variable_start_print_park_z_height: 50
variable_end_print_park_in: "back"
variable_pause_print_park_in: "front"
variable_filament_unload_length: 100
variable_filament_unload_speed: 5
variable_filament_load_length: 100
variable_filament_load_speed: 10
${helper.renderMacroVariableOverrides()}

#############################################################################################################
### LCD
### Pick your LCD configuration
#############################################################################################################
[include RatOS/printers/prusa-mk3s/display.cfg]

#############################################################################################################
### FILAMENT SENSOR
### Pick your filament sensor configuration
#############################################################################################################
[include RatOS/sensors/prusa-mini-filament-switch.cfg]

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

${helper.renderUserStepperSections({
        x: {
            directionInverted: false,
            additionalLines: [
                "position_endstop: 0 # Adjust this to your setup",
                "position_min: 0 # Adjust this to your setup",
                "position_max: 180 # Adjust this to your setup"
            ]
        },
        y: {
            directionInverted: false
        },
        z: {
            directionInverted: true
        },
        extruder: {
            directionInverted: false,
            additionalLines: [
                "pressure_advance: 0.04 # Check https://www.klipper3d.org/Pressure_Advance.html for pressure advance tuning.",
                "nozzle_diameter: 0.4 # Remember to change this if you change nozzle diameter.",
                "control: pid",
                "pid_kp: 20.184",
                "pid_ki: 0.836",
                "pid_kd: 121.862"
            ]
        }
    })}


[heater_bed]
control: pid
pid_kp: 63.567
pid_ki: 1.084
pid_kd: 932.049

[pause_resume]
recover_velocity: 50.

[stepper_z]
position_max: 185

[probe]
x_offset: -29
y_offset: -3

${helper.renderProbePinSection()}

${helper.renderReminders()}
`;


/***/ })

};
;