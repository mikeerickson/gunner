#!/usr/bin/env node

/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { dd } = require('dumper.js')
const system = require('../src/toolbox/system')
const shell = require('shelljs')
const colors = require('chalk')
const print = require('@codedungeon/messenger')

shell.exec('npm run bump')

const pkgInfo = require('../package.json')

// each item must be set accordingly
const config = {
  debug: true,
  runTests: true,
  buildCommand: false, // false or `npm run prod`
  build: pkgInfo?.build || '',
  version: pkgInfo.version,
}

// reusable shell result
let result = ''
let success = true

async function execute() {
  // result = shell.exec('npm run test -- --dot')
  result = await system.exec('npm', ['test', '--', '--dot'])

  success = config.runTests ? result.includes('PASSED') || result.includes('SUCCESS') : true
  if (!success) {
    print.error('Testing Failed, deployment aborted\n', 'ERROR')
    process.exit(1)
  }

  config.debug ? print.success('==> Testing Passed...') : null

  // execute build command
  if (config.buildCommand) {
    print.info(colors.bold('==> Creating Production Build...\n'))
    result = await system.exec('npm', ['run', 'prod'])
    if (!success) {
      print.error('Production Build Failed, deployment aborted', 'ERROR')
      process.exit()
    }
  } else {
    config.debug ? print.info('==> Producion Build Skipped') : null
  }

  console.log('')

  // add all files and commit
  print.info(colors.bold('==> Adding All Files\n'))
  result = shell.exec('git add .')
  config.debug ? console.log(`${result}`) : ''
  console.log('')

  // commit changes
  print.info(colors.bold(`==> Commting changes build ${config.build}\n`))
  result = shell.exec(`git commit -m "production build ${config.build}"`)
  config.debug ? console.log(`${result}`) : ''
  console.log('')

  // push changes to master
  print.info(colors.bold('==> Pushing to master branch\n'))
  result = shell.exec('git push origin master')
  config.debug ? console.log(`${result}`) : ''
  console.log('')

  // wrap up
  print.success(`v${config.version} build ${config.build} Deploy Completed Successfully`, 'SUCCESS')
  console.log('')

  success ? await system.exec('npm', ['run', 'todo']) : null
}

execute()
