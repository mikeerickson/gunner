/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('colors')
const { assert } = require('chai')
const system = require('./system.js')
const fs = require('./filesystem.js')
const filesystem = require('./filesystem.js')

const pkgMgr = {
  hasYarn: async () => {
    let yarnInstalled
    try {
      yarnInstalled = (await system.which('yarn2')) !== 'not found'
    } catch (e) {
      yarnInstalled = false
    }
    return yarnInstalled
  },
  hasYarnLock: function () {
    return fs.existsSync(fs.path.join(fs.cwd(), 'yarn.lock'))
  },
  npmInit: function () {
    system.run('npm init -y')
  },
  hasPackageJson: function () {
    fs.existsSync('package.json')
  },
  install: function (installCommand = '', options = { showCommand: false }) {
    let command = this.hasYarnLock() ? 'yarn add' : 'npm install'
    if (options.showCommand) {
      console.log(colors.cyan(command + ' ' + installCommand))
    }
    let result = system.run(command + ' ' + installCommand)
    let success = result.match(/success|added|updated/g).length > 0
    assert(true, success)
  },
  remove: function (removeCommand = '', options = { showCommand: false }) {
    let command = this.hasYarnLock() ? 'yarn remove' : 'npm uninstall'
    if (options.showCommand) {
      console.log(colors.cyan(command + ' ' + removeCommand))
    }
    let result = system.run(command + ' ' + removeCommand)
    let success = result.match(/success|removed/g).length > 0
    assert(true, success)
  },
}

module.exports = pkgMgr
