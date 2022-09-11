#!/bin/bash

cd /home/pi/pi2/Projeto-Carrossel-Semi-Automatico-PI2-Documentacao/backend/ 
source .venv39/bin/activate
sudo python3.9 manage.py runserver 0.0.0.0:8000 &

