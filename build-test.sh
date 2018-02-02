#!/bin/sh
# This is a comment!
echo "Compilando proyecto en C++ llamado test.cpp."
g++ test.cpp
touch index.html
echo "<b>Esto es un index.</b>" >> index.html

# Set the destination server
DEST=evomatik@10.0.2.152:/home/evomatik/Downloads

# Setting the packaged dist name
BUILD_NAME="test-compiled-$(date +'%m%d%y').tgz"

# Create the tarball of the build
echo "Empaquetando a.out para subirlo al server"
tar cvzf builds/$BUILD_NAME index.html

# Upload to DEST/DIR_NAME
echo "Intentando subir el paquete al servidor (/home/evomatik/Downloads)"
#scp builds/$BUILD_NAME $DEST # este es el antiguo metodo, no sirve en GoCD
sshpass -p "evo100518" scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r builds/$BUILD_NAME $DEST