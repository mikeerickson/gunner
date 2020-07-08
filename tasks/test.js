#!/usr/bin/env node

const colors = require('colors')
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
