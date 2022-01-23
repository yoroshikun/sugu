#!/bin/bash

yarn install # Check install dependencies
yarn build # Build the app
cp -r ./public ./firefox # Copy the build to the firefox folder
rm -rf ./firefox/manifest.v3.json ./firefox/manifest.json # Remove the unused manifest.v3.json and manifest.json files
mv ./firefox/manifest.v2.json ./firefox/manifest.json # Rename the manifest.v3.json file to manifest.json
