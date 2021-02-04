/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('chalk')
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

    // actual package manager outline will vary depending on version
    // updated to support npm 7 output "up to date"
    return result.match(/success|added|updated|up to date/g).length > 0
  },
  remove: function (removeCommand = '', options = { showCommand: false }) {
    let command = this.hasYarnLock() ? 'yarn remove' : 'npm uninstall'
    if (options.showCommand) {
      console.log(colors.cyan(command + ' ' + removeCommand))
    }
    let result = system.run(command + ' ' + removeCommand)
    return result.match(/success|removed/g).length > 0
  },
}

module.exports = pkgMgr
