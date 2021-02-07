#!/usr/bin/env node

const CLI = require('./src/gunner')
const pkgInfo = require('./package.json')

const app = new CLI(process.argv, __dirname)
  .usage(`${pkgInfo.packageName} make:command TestCommand --name test:command`)
  .options(/* if not called, options will be suppressed in help dialog */)
  .version(/* version string override, if not supplied default version info will be displayed */)
  .examples(
    /* if not called, examples will be suppressed in help dialog */
    `${pkgInfo.packageName} make:command TestCommand --name hello`
  )
  .run()
