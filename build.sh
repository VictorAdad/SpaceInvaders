#!/bin/bash

# Script de distribución para app SIGI escrita en Angular 4 (https://angular.io/)
# Este script corre uno de los scripts declarados en package.json (deploy-test o deploy-prod) dependiendo el ambiente que se desee compilar,
# creando la distribución correspondiente. A continuación empaqueta la distribución y la sube al servidor declarado en la variable $DEST
# Opcionalmente se sube directamente al directorio que corresponda según el ambiente (sigi|sigi-test)
#
# Si se desean agregar más ambientes será necesario realizar los siguientes pasos:
# 1. Crear un nuevo archivo de ambiente en sigi/src/environments llamado "environment.{ambiente}.ts"
# 2. Declarar en dicho archivo el host del backend que utilizara la app y el propio host desde donde se consumirá el front (ver ejemplos "environment.test.ts" y "environment.prod.ts")
# 3. Declarar el nuevo archivo de ambiente en .angular-cli.json, dentro del valor "environments" (ver ejemplos anteriores)
# 4. Declarar un nuevo script en package.json que corresponda al ambiente nuevo que se desea compilar, personalizando el archivo de ambiente que utilizará y la ruta base (esta se debe configurar en el apache que servirá la app)
# 5. Modificar los condicionales de este script de acuerdo al nuevo parámetro deseado para compilar el nuevo ambiente.
#
# v0.1 - 24/10/2017
# v0.2 - 29/11/2017

# Run npm to create the production build
if [ $# -eq 0 ]; then
    echo "¿Qué ambiente quieres compilar? [test|prod|iph]"
    exit 1
else
    if [ $1 == "test" ]; then
      echo "Compilando ambiente test (http://10.0.30.14/sigi/)"
      npm run deploy-test
      DIR_NAME="sigi"
    elif [ $1 == "prod" ]; then
      echo "Compilando ambiente prod (http://sigi.evomatik.net/sigi-test/)"
      npm run deploy-prod
      DIR_NAME="sigi-test"
    elif [ $1 == "iph" ]; then
      echo "Compilando ambiente iph (http://sigi.evomatik.net/iph/)"
      npm run deploy-iph
      DIR_NAME="iph"
    else
      echo "Opciones aceptadas: [test|prod|iph]"
      exit 1
    fi
fi

# Set the destination server
DEST=evomatik@10.0.30.14:/home/evomatik/Downloads/frontend

# Setting the packaged dist name
BUILD_NAME=$DIR_NAME"-$(date +'%m%d%y').tgz"

# Create the tarball of the build
echo "Empaquetando la distribución para subir al server"
tar cvzf builds/$BUILD_NAME dist

# Upload to DEST/DIR_NAME
echo "Intentando subir el paquete al servidor"
scp builds/$BUILD_NAME $DEST/$DIR_NAME
