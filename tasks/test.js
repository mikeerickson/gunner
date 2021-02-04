#!/usr/bin/env node

/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('chalk')
const fs = require('fs')
const path = require('path')
const { spawnSync } = require('child_process')

let filename = process.argv[2] || '*.test.js' // if no filename supplied, it will run against all tests

// do some test filename massaging in case we didnt supply ".test"
if (!filename.includes('test')) {
  let ext = path.extname(filename) || '.js'
  filename = filename.replace(ext, '') + '.test' + ext
}

console.log('')
console.log(colors.cyan(`==> Test Specification './test/${filename}'`))
spawnSync('mocha', ['./test/' + filename, '--reporter', 'mocha-better-spec-reporter', '--timeout 5000'], {
  stdio: 'inherit',
})
spawnSync('node', ['./test/utils/testCleanup.js'], { stdio: 'inherit' })
