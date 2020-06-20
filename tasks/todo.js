#!/usr/bin/env node
/*eslint no-console: "off"*/

// NOTE: Make sure `leasot` is installed globally, otherwise you can use package version
// NOTE: ./node_modules/.bin/leasot

const { spawnSync } = require('child_process')
const colors = require('colors')

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
  console.log(colors.green(`✅  ${todoFilename} file created successfully`))
}
