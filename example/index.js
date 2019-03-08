#!/usr/bin/env node

const path = require('path')

// if not using env value, pass to construtor
// process.env.ROOT = path.dirname(__filename)

let CLI = require('../src/gunner')
let app = new CLI(process.argv, path.dirname(__filename)).start()
