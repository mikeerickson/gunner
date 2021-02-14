#!/usr/bin/env node

const { CLI } = require('./src/gunner')
const pkgInfo = require('./package.json')
const path = require('path')

const app = new CLI(process.argv, path.join(__dirname))
  .usage(`${pkgInfo.packageName} make:command TestCommand --name test:command`)
  .options(/* if not called, options will be suppressed in help dialog */)
  .examples(
    /* if not called, examples will be suppressed in help dialog */
    `${pkgInfo.packageName} make:command TestCommand --name hello --description "hello command description"`
  )
  .run()
