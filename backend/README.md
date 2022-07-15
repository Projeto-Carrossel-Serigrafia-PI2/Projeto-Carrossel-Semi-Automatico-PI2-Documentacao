### Instalação Local 

Para iniciar instale a versão 3.10 do Python e depois siga os passos abaixo :

``` bash
cd BACKEND
```
``` bash
python -m venv venv  
```
``` bash
.\venv\Scripts\Activate.ps1 
```
``` bash
 pip install django djangorestframework
```
``` bash
python manage.py makemigrations
```
``` bash
python manage.py migrate
```
``` bash
python manage.py runserver  
``` 

Agora abra o navegador e vá para: "http://localhost:8000" e você deve ver a tela inicial do Django:  