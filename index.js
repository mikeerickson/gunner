#!/usr/bin/env node

const path = require('path')
const argsParser = require('minimist')

process.env.ROOT = path.dirname(__filename)

// all good, start the CLI
// methods (help, commands, etc) not supplying text, will show default
let CLI = require('./src/gunner')

let defaultConfig = { command: 'test', args: { a: true, language: 'php' } }

let initProcess = process
let cliArguments = argsParser(process.argv)

const app = new CLI(process.argv)
  .usage('gunner make:command --name TestCommand')
  .help()
  .commands()
  .examples()
  .run()
