#!/usr/bin/env bash

meteor build bundle
ssh iot-hackaton@185.5.97.71 'forever stopall && rm -r bundle bundle.tar.gz'
scp bundle/server.tar.gz iot-hackaton@185.5.97.71:/home/iot-hackaton/bundle.tar.gz
ssh iot-hackaton@185.5.97.71 "tar xf bundle.tar.gz && cd bundle/programs/server && npm install && export MONGO_URL='mongodb://healthy-way:healthy-way@localhost:27018/healthy-way' && export ROOT_URL='http://localhost' && export PORT=3000 && forever start ../../main.js"
rm -r bundle