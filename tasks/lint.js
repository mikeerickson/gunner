const fs = require('fs')
const execa = require('execa')
const msg = require('@codedungeon/messenger')

execa('./node_modules/.bin/eslint', ['./**/*.{ts,tsx,js,jsx,vue}'], { env: { FORCE_COLOR: 'true' } })
  .then((data) => {
    console.log('')
    msg.success('No linting errors found', 'SUCCESS')
    console.log('')
  })
  .catch((data) => {
    console.log(data.stdout)
    msg.error('Linting errors found', 'ERROR')
    console.log('')
  })
