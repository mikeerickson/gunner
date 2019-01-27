#!/usr/bin/env node

const colors = require('chalk')
const pkg = require('./package.json')
const updateNotifier = require('update-notifier')
const pleaseUpgradeNode = require('please-upgrade-node')

// check node version
pleaseUpgradeNode(pkg, {
  exitCode: 0,
  message: requiredVersion => {
    return colors.red(`\n 🚫  ${pkg.packageName} requires Node version ${requiredVersion} or greater.`)
  }
})

// check for any cli updates
updateNotifier({ pkg }).notify()

// all good, start the CLI
let CLI = require('./src/gunner')
new CLI(process.argv)
