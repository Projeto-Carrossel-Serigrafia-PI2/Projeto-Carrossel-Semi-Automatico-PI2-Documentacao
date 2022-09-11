#!/bin/bash

sudo systemctl stop dnsmasq
sudo systemctl stop hostapd

echo "edit /etc/dhcpcd.conf ==> static ip address"
echo "put there => interface wlan0 /n static ip_address=192.168.0.10/24 /n nohook wpa_supplicant"
echo "sudo service dhcpcd restart"
echo "sudo systemctl start dnsmasq"
echo "sudo systemctl unmask hostapd"
echo "sudo systemctl enable hostapd"
echo "sudo systemctl start hostapd"
echo
echo "[x] now reboot ==> sudo reboot"

