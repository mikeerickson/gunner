#!/bin/bash

./node_modules/.bin/eslint "./**/*.{ts,tsx,js,jsx,vue}" "$@"
if [ $? == 0 ]; then
  node ./tasks/success.js "ESLint" "No linting errors found"
else
  node ./tasks/fail.js "ESLint" "Linting errors found"
fi
