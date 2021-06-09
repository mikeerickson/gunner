#!/usr/bin/env node

/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('chalk')
const shell = require('shelljs')
const msg = require('@codedungeon/messenger')

// bump build
shell.exec('npm run bump:dev')

const pkgInfo = require('../package.json')

// each item must be set accordingly
const config = {
  debug: true,
  runTests: true,
  build: pkgInfo?.build || '',
  buildCommand: false, // false or `npm run prod`
  version: pkgInfo.version,
}

// reusable shell result
let result = ''
let success = true

result = shell.exec('npm run test -- --dot')
success = config.runTests ? result.includes('PASSED') || result.includes('SUCCESS') : true
if (!success) {
  msg.error('Testing Failed, deployment aborted\n', 'ERROR')
  process.exit(1)
}

// execute build command
config.buildCommand ? msg.info(colors.bold('==> Creating Production Build...\n')) : null
config.buildCommand ? shell.exec(config.buildCommand) : null
console.log('')

// add all files and commit
msg.info(colors.bold('==> Adding All Files\n'))
result = shell.exec('git add .')
config.debug ? console.log(`${result}`) : ''
console.log('')

// commit changes
msg.info(colors.bold(`==> Commting changes build ${config.build}\n`))
result = shell.exec(`git commit -m "production build ${config.build}"`)
config.debug ? console.log(`${result}`) : ''
console.log('')

// push changes to master
msg.info(colors.bold('==> Pushing to master branch\n'))
result = shell.exec('git push origin master')
config.debug ? console.log(`${result}`) : ''
console.log('')

// wrap up
msg.success(`Build ${config.build} Deploy Completed Successfully`, 'SUCCESS')
console.log('')

success ? shell.exec('npm run todo') : null

config.debug ? console.log(`${result}`) : ''
