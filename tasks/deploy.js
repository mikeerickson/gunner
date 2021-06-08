/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('chalk')
const shell = require('shelljs')
const msg = require('@codedungeon/messenger')
let pkgInfo = require('../package.json')

// each item must be set accordingly
let config = {
  debug: true,
  runTests: true,
  build: pkgInfo?.build || '',
  buildCommand: false, // false or `npm run prod`
  version: pkgInfo.version,
}

// reusable shell result
let success = true

let result = shell.exec('npm run test -- --dot')
success = config.runTests ? result.includes('PASSED') || result.includes('SUCCESS') : true
if (!success) {
  msg.error('Testing Failed, deployment aborted\n', 'ERROR')
  process.exit(1)
}

// execute build command
config.buildCommand ? msg.info('==> Creating Production Build...') : null
config.buildCommand ? shell.exec(config.buildCommand) : null
console.log('')

// add all files and commit
msg.info('==> Adding All Files')
result = shell.exec('git add .')
config.debug ? console.log(`${result}`) : ''
console.log('')

// commit changes
msg.info(`==> Comming changes build ${config.build}`)
result = shell.exec(`git commit -m "production build ${config.build}"`)
debug ? console.log(`${result}`) : ''
console.log('')

// push changes to master
msg.info('==> Pushing to master')
result = shell.exec('git push origin master')
debug ? console.log(`${result}`) : ''
console.log('')

// wrap up
msg.success(`Build ${config.build} Deploy Completed Successfully`, 'SUCCESS')
console.log('')

debug ? console.log(`${result}`) : ''

// if all good, run np
success ? shell.exec('np') : msg.error('Errors occured, deployment aborted', 'ERROR')
