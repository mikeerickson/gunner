#!/usr/bin/env node

const path = require('path')
const argsParser = require('minimist')

process.env.ROOT = path.dirname(__filename)

// all good, start the CLI
// methods (help, commands, etc) not supplying text, will show default
let CLI = require('./src/gunner')
let cliArguments = argsParser(process.argv)

const app = new CLI(process.argv)
  .usage('gunner make:command TestCommand --name test:command')
  .options()
  .examples('make:command TestCommand --name hello')
  .run({ name: 'default' })
