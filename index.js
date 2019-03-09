#!/usr/bin/env node

const path = require('path')
process.env.ROOT = path.dirname(__filename)

// all good, start the CLI
// methods (help, commands, etc) not supplying text, will show default
let CLI = require('./src/gunner')
const app = new CLI(process.argv)
  .usage('  gunner make:command --name TestCommand')
  .help()
  .commands()
  .options()
  .examples()
  .run({ command: 'test', args: { a: true, language: 'php' } })
