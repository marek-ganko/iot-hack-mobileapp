#!/usr/bin/env bash

meteor build bundle.tar.gz
scp bundle.tar.gz iot-hackaton@185.5.97.71:/home/iot-hackaton/bundle.tar.gz
ssh iot-hackaton@185.5.97.71 'tar xf bundle.tar.gz && cd bundle/programs/server && npm install && export MONGO_URL='mongodb://healthy-way:healthy-way@localhost:27018/healthy-way' && export ROOT_URL='http://localhost' && export PORT=3000 && forever stopall && forever start ../../main.js'
rm -r bundle.tar.gz