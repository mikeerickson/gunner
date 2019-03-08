#!/usr/bin/env node

const path = require('path')
process.env.ROOT = path.dirname(__filename)

// all good, start the CLI
let CLI = require('./src/gunner')
const app = new CLI(process.argv)
  .usage('  gunner make:command --name TestCommand')
  .help()
  .commands()
  .options()
  .examples()
  .start()
