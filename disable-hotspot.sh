#!/bin/bash

sudo systemctl stop hostapd

echo "edit /etc/dhcpcd.conf ==> comment lines related to static ip address"
echo "run: sudo systemctl restart dhcpcd"
echo "[x] now reboot ==> sudo reboot"

