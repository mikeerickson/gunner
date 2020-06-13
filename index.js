#!/usr/bin/env node

const path = require('path')
const chalk = require('chalk')
const pkg = require('./package.json')
const argsParser = require('minimist')
const updateNotifier = require('update-notifier')
const pleaseUpgradeNode = require('please-upgrade-node')

// check node version
pleaseUpgradeNode(pkg, {
  exitCode: 0,
  message: requiredVersion => {
    return chalk.red('\n 🚫  Gunner requires Node version ' + requiredVersion + ' or greater.')
  }
})

// check for any cli updates
updateNotifier({ pkg }).notify()

// =============================================================================================

let CLI = require('./src/gunner')
let cliArguments = argsParser(process.argv)

const app = new CLI(process.argv, path.dirname(__filename))
  .usage('gunner make:command TestCommand --name test:command')
  .options() // show options
  .examples('make:command TestCommand --name hello') // show example
  .run({ name: 'default' })
