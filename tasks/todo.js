#!/usr/bin/env node
/*eslint no-console: "off"*/

// NOTE: Make sure `leasot` is installed globally, otherwise you can use package version
// ./node_modules/.bin/leasot

const { spawnSync } = require('child_process')

// get all flags
const output = process.argv.indexOf('-o') > 0 || process.argv.indexOf('--output') > 0
const quiet = process.argv.indexOf('-q') > 0 || process.argv.indexOf('--quiet') > 0

// if output (-o, --output) flag supplied, reporter written to TODO.md
if (output) {
  spawnSync('leasot', ['./**/*.{ts,js,vue}', '--ignore', './node_modules', '>', 'TODO.md'], {
    stdio: 'inherit',
    shell: true
  })
}
// if we didnt supply quiet (-q, --quiet) flag, show report
if (!quiet) {
  spawnSync('leasot', ['./**/*.{ts,js,vue}', '--ignore', './node_modules'], {
    stdio: 'inherit',
    shell: true
  })
}

// spawnSync('mdv', ['-c', '120', 'TODO.md'], { stdio: 'inherit' })
