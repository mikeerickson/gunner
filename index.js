#!/usr/bin/env node

const { CLI } = require('./src/gunner')
const pkgInfo = require('./package.json')
const path = require('path')
const colors = require('chalk')
const config = require('./src/toolbox/config')
const begoo = require('begoo')
const { dd } = require('dumper.js')

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

const app = new CLI(process.argv, path.join(__dirname), pkgInfo)
  .usage(`${pkgInfo.packageName} ${colors.magenta.bold('<command>')} ${colors.cyan.bold('[options]')}`)
  .options(/* if not called, options will be suppressed in help dialog */)
  .examples(
    /* if not called, examples will be suppressed in help dialog */
    `${pkgInfo.packageName} make:command TestCommand --name hello --description "hello command description"`
  )
  .logger({ alwaysLog: true })
  .hooks({
    beforeExecute: (toolbox, command = '', args = {}) => {
      toolbox.print.write('info', { hook: 'beforeExecute', command, args, cwd: process.cwd() })
    },
    afterExecute: (toolbox, command = '', args = {}) => {
      toolbox.print.write('info', { hook: 'afterExecute', command, args })
    },
    commandPrefix: 'make:',
  })
  .run()
