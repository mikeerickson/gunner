#!/usr/bin/env node

const path = require('path')
process.env.ROOT = path.dirname(__filename)

// all good, start the CLI
let CLI = require('../src/gunner')
new CLI(process.argv)
