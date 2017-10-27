# Distribution build script for Angular app
# v0.1 - 24/10/2017

# Build name
BUILD_NAME="sigi-$(date +'%m%d%y').tgz"

# Run npm to create the production build
npm run deploy

# Create the tarball of the build
tar cvzf builds/$BUILD_NAME dist

# Upload to the TEST server (10.0.30.14)
#scp builds/$BUILD_NAME 10.0.30.14:/home/evomatik/Downloads
