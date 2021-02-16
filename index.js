#!/usr/bin/env node

const { CLI } = require('./src/gunner')
const pkgInfo = require('./package.json')
const path = require('path')
const colors = require('chalk')
const config = require('./src/toolbox/config')
const begoo = require('begoo')

if (!config.get('init', false)) {
  let msg =
    colors.green('Welcome to Gunner') +
    '\n' +
    colors.yellow(pkgInfo.description) +
    '\n' +
    'v' +
    pkgInfo.version +
    ' build ' +
    pkgInfo.build
  console.log(begoo(msg, { avatar: 'dog' }))
  config.set('init', true)
}

const app = new CLI(process.argv, path.join(__dirname))
  .usage(`${pkgInfo.packageName} ${colors.magenta('[command]')} ${colors.cyan('<options>')}`)
  .options(/* if not called, options will be suppressed in help dialog */)
  .examples(
    /* if not called, examples will be suppressed in help dialog */
    `${pkgInfo.packageName} make:command TestCommand --name hello --description "hello command description"`
  )
  .run()
