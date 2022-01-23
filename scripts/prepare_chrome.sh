#!/bin/bash

yarn install # Check install dependencies
yarn build # Build the app
cp -r ./public ./chrome # Copy the build to the chrome folder
rm -rf ./chrome/manifest.v2.json ./chrome/mainfest.json # Remove the unused manifest.v2.json and manifest.json files
mv ./chrome/manifest.v3.json ./chrome/manifest.json # Rename the manifest.v3.json file to manifest.json
