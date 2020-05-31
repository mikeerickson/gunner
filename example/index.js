#!/usr/bin/env node

const path = require('path')

let CLI = require('../src/gunner')
// let CLI = require('gunner')

new CLI(process.argv)
  .name('Gunner Example')
  // .options(' ') //setting option to string > 0, overrides default
  .usage('gunner create-project <options>')
  .run()
