#!/bin/sh
# compilamos el archivo cpp
echo "Compilando proyecto en C++ llamado test.cpp"
g++ test.cpp

# creamos el archivo html
echo "Creando el archivo llamado index.html"
touch index.html

# insertando codigo html en el index
echo "Insertando codigo html en el index.html"
echo "<b>Esto es un index.</b>" >> index.html

# Set the destination server
DEST=evomatik@10.0.2.152:/home/evomatik/Downloads

# Setting the packaged dist name
BUILD_NAME="test-compiled-$(date +'%m%d%y').tgz"

# Create the tarball of the build
echo "Empaquetando index.html para subirlo al server"
tar cvzf builds/$BUILD_NAME index.html

# Upload to DEST
echo "Intentando subir el paquete al servidor (/home/evomatik/Downloads).."
#scp builds/$BUILD_NAME $DEST # este es el antiguo metodo, no sirve en GoCD
sshpass -p "evo100518" scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r builds/$BUILD_NAME $DEST