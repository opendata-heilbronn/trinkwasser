#!/bin/bash

sed -i "s^__API_ENDPOINT__^$API_ENDPOINT^g" /app/src/js/config.js

cd /app
npm start