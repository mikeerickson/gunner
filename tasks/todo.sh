#!/bin/bash

leasot './**/*.{ts,js,vue}' --ignore './node_modules/**/*.js,./node_modules/**/*.ts' --tags review
if [ $? == 0 ]; then
  node ./tasks/success.js "Leasot" "No Issues Found"
else
  node ./tasks/fail.js "Todo Issues found"
  # mdv TODO.md
fi
