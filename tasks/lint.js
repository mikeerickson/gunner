#!/usr/bin/env node

/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

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
