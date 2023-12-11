#!/bin/bash
if [ "$EUID" -ne 0 ]
  then echo "ERROR: Please run as root"
  exit
fi
MCU=$1
FLASH_PATH=${2:-$MCU}
if [ "$MCU" == "" ]; then
	echo "ERROR: Please specify a device to flash"
	exit
fi
pushd /home/pi/klipper || exit
service klipper stop
echo "Flashing $MCU at $FLASH_PATH"
make flash FLASH_DEVICE="$FLASH_PATH"
sleep 5
if [ -h "$MCU" ]; then
    echo "Flashing Successful!"
else
    echo "Flashing failed :("
    service klipper start
    popd || exit
    chown pi:pi -R /home/pi/klipper
    exit 1
fi
chown pi:pi -R /home/pi/klipper
service klipper start
popd || exit
