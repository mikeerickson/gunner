#!/usr/bin/env node

const path = require('path')

let CLI = require('../src/gunner')
new CLI(process.argv).run()
