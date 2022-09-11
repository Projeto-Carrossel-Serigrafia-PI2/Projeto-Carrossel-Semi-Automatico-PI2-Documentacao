#!/bin/bash

sudo systemctl stop dnsmasq
sudo systemctl stop hostapd

echo "edit /etc/dhcpcd.conf ==> static ip address"
echo "sudo service dhcpcd restart"
echo "sudo systemctl start dnsmasq"
echo "sudo systemctl unmask hostapd"
echo "sudo systemctl enable hostapd"
echo "sudo systemctl start hostapd"
echo
echo "[x] now reboot ==> sudo reboot"

