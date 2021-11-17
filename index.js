#!/usr/bin/env node

const { CLI } = require('./src/gunner')
const pkgInfo = require('./package.json')
const path = require('path')
const colors = require('chalk')
const config = require('./src/toolbox/config')
const begoo = require('begoo')
let parseArgs = require('minimist')

console.log('test')

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

const getLogDirectory = (argv, defaultLocation = 'system') => {
  let logDir = parseArgs(argv)['logDir'] || parseArgs(argv)['log-dir'] || ''
  return logDir.length > 0 ? logDir : defaultLocation
}

const app = new CLI(process.argv, path.join(__dirname), pkgInfo)
  .usage(`${pkgInfo.packageName} ${colors.magenta.bold('<command>')} ${colors.cyan.bold('[options]')}`)
  .options(/* if not called, options will be suppressed in help dialog */)
  .examples(
    [
      `${pkgInfo.packageName} new ${colors.magenta('MyCLI')} ${colors.gray(
        '(generates new CLI project in current directory)'
      )}`,
      `  ${pkgInfo.packageName} make:command ${colors.magenta('TestCommand')} ${colors.cyan(
        '--name hello --description "hello command description"'
      )}`,
      `  ${pkgInfo.packageName} make:extension ${colors.magenta('machine-info-extension')} ${colors.cyan(
        '--function "machineInfo"'
      )}`,
    ].join('\n')
  )
  .logger({ directory: getLogDirectory(process.argv), alwaysLog: true })
  .hooks({
    beforeExecute: (toolbox, command = '', args = {}) => {
      toolbox.print.write('debug', { hook: 'beforeExecute', command, args, cwd: process.cwd() })
    },
    afterExecute: (toolbox, command = '', args = {}) => {
      toolbox.print.write('debug', { hook: 'afterExecute', command, args })
    },
    commandPrefix: 'make:',
  })
  .run()
