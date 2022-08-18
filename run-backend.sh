#!/bin/bash

cd /home/pi/pi2/Projeto-Carrossel-Semi-Automatico-PI2-Documentacao/backend/ 
source .venv/bin/activate
sudo python3 manage.py runserver &

