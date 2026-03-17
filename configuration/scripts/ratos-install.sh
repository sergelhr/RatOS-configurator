#!/bin/bash
# This script install additional dependencies
# for RatOS.

PKGLIST="python3-numpy python3-matplotlib curl"

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# shellcheck source=./scripts/ratos-common.sh
source "$SCRIPT_DIR"/ratos-common.sh

install_dependencies()
{
    report_status "Installing RatOS dependencies"
    # shellcheck disable=SC2086
    sudo apt-get update && sudo apt-get install -y $PKGLIST
}

install_printer_config()
{
    report_status "Copying printer configuration"
    PRINTER_CFG="/home/pi/printer_data/config/printer.cfg"
    tail -n +2 /home/pi/printer_data/config/RatOS/templates/initial-printer.template.cfg > $PRINTER_CFG
}

install_udev_rules()
{
    report_status "Installing udev rules (nosuid-safe per-file loop)"
    # The original used `sudo ln -s boards/*/*.rules /etc/udev/rules.d/` which
    # fails in the image build chroot (nosuid mount makes sudo non-functional).
    # Loop per-file and fall back to cp when ln -s fails.
    local boards_dir="/home/pi/printer_data/config/RatOS/boards"
    find "$boards_dir" -name '*.rules' | while read -r rules_file; do
        target="/etc/udev/rules.d/$(basename "$rules_file")"
        sudo rm -f "$target"
        if ! sudo ln -sf "$rules_file" "$target" 2>/dev/null; then
            echo "ln -s failed (nosuid/chroot), using cp for $(basename "$rules_file")"
            sudo cp --preserve=mode "$rules_file" "$target"
        fi
    done
}

verify_ready()
{
    if [ "$EUID" -eq 0 ]; then
        echo "This script must not run as root"
        exit 1
    fi
}

# Force script to exit if an error occurs
set -xe

verify_ready
install_printer_config
install_udev_rules
install_beacon
install_hooks
install_dependencies
ensure_sudo_command_whitelisting sudo
register_gcode_shell_command
register_ratos_homing
register_z_offset_probe
register_ratos
register_resonance_generator
register_ratos_kinematics#!/usr/bin/env bash
# This script installs additional dependencies for RatOS.

SCRIPT_DIR=$( cd -- "$( dirname -- "$(realpath -- "${BASH_SOURCE[0]}")" )" &> /dev/null && pwd )
CFG_DIR=$(realpath "$SCRIPT_DIR/..")

# shellcheck source=./configuration/scripts/ratos-common.sh
source "$SCRIPT_DIR"/ratos-common.sh

install_dependencies()
{
    report_status "Installing RatOS dependencies"
    # shellcheck disable=SC2086
    $SUDO apt-get update && $SUDO apt-get install -y $PKGLIST
}

install_printer_config()
{
    report_status "Copying printer configuration"
    PRINTER_CFG="${RATOS_PRINTER_DATA_DIR}/config/printer.cfg"
    tail -n +2 "$CFG_DIR"/templates/initial-printer.template.cfg > "$PRINTER_CFG"
    # Ensure correct ownership if running as root
    if [ "$EUID" -eq 0 ]; then
        chown "${RATOS_USERNAME}:${RATOS_USERGROUP}" "$PRINTER_CFG"
    fi
}

install_udev_rules()
{
    report_status "Installing udev rules"
    # The original `$SUDO ln -sf boards/*/*.rules /etc/udev/rules.d/` fails
    # inside the image build chroot because the mount has nosuid set, making
    # sudo non-functional. Loop per-file and fall back to cp when ln -s fails.
    find "$CFG_DIR/boards" -name '*.rules' | while read -r rules_file; do
        target="/etc/udev/rules.d/$(basename "$rules_file")"
        $SUDO rm -f "$target"
        if ! $SUDO ln -sf "$rules_file" "$target" 2>/dev/null; then
            echo "ln -s failed (nosuid/chroot), using cp for $(basename "$rules_file")"
            $SUDO cp --preserve=mode "$rules_file" "$target"
        fi
    done
}


# Force script to exit if an error occurs
set -xe

verify_ready
install_printer_config
install_udev_rules
install_beacon
install_hooks
install_dependencies
ensure_sudo_command_whitelisting
verify_registered_extensions
