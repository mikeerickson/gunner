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
  .logger('logs')
  .hooks({
    beforeExecute: (toolbox, command = '', args = {}, data = null) => {
      toolbox.print.write('log', { hook: 'beforeExecute', command, args, data })
    },
    afterExecute: (toolbox, command = '', args = {}, data = null) => {
      toolbox.print.write('log', { hook: 'afterExecute', command, args, data })
    },
    commandPrefix: 'make:',
  })
  .run()
