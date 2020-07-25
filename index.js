#!/usr/bin/env node

let CLI = require('./src/gunner')

const app = new CLI(process.argv, __dirname)
  .usage('gunner make:command TestCommand --name test:command')
  .options()
  .examples('make:command TestCommand --name hello')
  .run()
