#!/bin/bash

# Script de distribución para app SIGI escrita en Angular 4 (https://angular.io/)
# Este script corre uno de los scripts declarados en package.json (deploy-test o deploy-prod) dependiendo el ambiente que se desee compilar,
# creando la distribución correspondiente. A continuación empaqueta la distribución y la sube al servidor declarado en la variable $DEST
# Opcionalmente se sube directamente al directorio que corresponda según el ambiente (sigi|sigi-test).
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
# v0.3 - 05/02/2018 - Se añaden las variables para los ambientes productivos de la Fiscalía
# v0.4 - 09/02/2018 - Se añade el sed para agregar la ruta relativa del service worker al index.html

# Run script to create the production build
if [ $# -eq 0 ]; then
    printf "\33[42m ¿Qué ambiente quieres compilar? [evo-sigi | sigi-test | fiscalia] \e[0m \n"
    exit 1
else
    if [ $1 == "evo-sigi" ]; then
      printf "\33[42m Compilando ambiente evo-sigi (http://sigi.evomatik.net/evo-sigi/) \e[0m \n"
      npm run deploy-test
      DIR_NAME="evo-sigi"
    elif [ $1 == "sigi-test" ]; then
      printf "\33[42m Compilando ambiente sigi-test (http://sigi.evomatik.net/sigi-test/) \e[0m \n"
      npm run deploy-prod
      DIR_NAME="sigi-test"
    elif [ $1 == "fiscalia" ]; then
      printf "\33[42m Compilando ambiente productivo para Fiscalía (https://sigi.fiscaliaedomex.gob.mx/sigi/) \e[0m \n"
      npm run deploy-fiscalia
      DIR_NAME="sigi"
    else
      printf "\33[41m Opciones aceptadas: [evo-sigi | sigi-test | fiscalia] \e[0m \n"
      exit 1
    fi
fi

# Asking what operative system I'm using
OS=$(uname -s)

# Set the destination server
DEST=evomatik@10.0.30.14:/home/evomatik/Downloads/frontend

# Setting the packaged dist name
BUILD_NAME=${DIR_NAME}"-$(date +'%m%d%y').tgz"

# Creating the build_path and setting it into a variable
mkdir -p builds/${DIR_NAME}
BUILD_PATH="builds/"${DIR_NAME}

# Run script to prepare service-worker
printf "\33[42m Corriendo script precache para la creación / actualización del service worker \e[0m \n"
npm run precache

if [ ${OS} = "Linux" ]
then
  #Replace service-worker path relative to the base-url
  printf "\33[42m Estas usando Linux. \e[0m \n"
  printf "\33[42m Reemplazando la ruta de service worker en dist/index.html \e[0m \n"
  sed -i 's/\/service-worker.js/\/'${DIR_NAME}'\/service-worker.js/g' dist/index.html
else
  # Replace service-worker path relative to the base-url
  printf "\33[42m Estas usando Mac OS. \e[0m \n"
  printf "\33[42m Reemplazando ruta de service worker en dist/index.html \e[0m \n"
  sed -i "" 's/\/service-worker.js/\/'${DIR_NAME}'\/service-worker.js/g' dist/index.html
fi

# Create the tarball of the build
printf "\33[42m Empaquetando distribución \e[0m \n"
tar czf ${BUILD_PATH}/${BUILD_NAME} dist

# Upload to DEST/DIR_NAME
printf "\33[42m Intentando subir ${BUILD_NAME} hacia ${DEST}/${DIR_NAME} \e[0m \n"
scp ${BUILD_PATH}/${BUILD_NAME} ${DEST}/${DIR_NAME}
