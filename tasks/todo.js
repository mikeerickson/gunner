#!/usr/bin/env node
/*eslint no-console: "off"*/

const { spawnSync } = require('child_process')
const colors = require('chalk')

// get all flags
const output = process.argv.indexOf('-o') > 0 || process.argv.indexOf('--output') > 0
const quiet = process.argv.indexOf('-q') > 0 || process.argv.indexOf('--quiet') > 0

const todoFilename = './TODO.md'

// if we didnt supply quiet (-q, --quiet) flag, show report
if (!quiet) {
  spawnSync('leasot', ['./**/*.{ts,js,vue}', '--ignore', './node_modules'], { stdio: 'inherit' })
}

// if output (-o, --output) flag supplied, report written to TODO.md
if (output) {
  spawnSync('leasot', ['./**/*.{ts,js,vue}', '--ignore', './node_modules', '>', todoFilename], {
    shell: true,
  })
  console.log('')
  console.log(colors.green(`✅  ${todoFilename} Created Successfully`))
}
console.log('')
