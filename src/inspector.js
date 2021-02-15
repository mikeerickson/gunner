/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('ansi-colors')
const pkg = require('../package.json')
const updateNotifier = require('update-notifier')
const pleaseUpgradeNode = require('please-upgrade-node')

const inspector = {
  startup: async () => {
    // inspet node version
    pleaseUpgradeNode(pkg, {
      exitCode: 0,
      message: (requiredVersion) => {
        requiredVersion = '>=' + requiredVersion
        return colors.yellow('\n 🚧 Gunner requires Node version ' + requiredVersion + '.\n')
      },
    })

    updateNotifier({ pkg }).notify()
  },
  versionCheck: async () => {
    const latestVersion = require('latest-version')
    const chalk = require('chalk')

    let result = await latestVersion(pkg.name)

    const template =
      'Update available ' +
      chalk.dim('{currentVersion}') +
      chalk.reset(' → ') +
      chalk.green('{latestVersion}') +
      ' \nRun ' +
      chalk.cyan('{updateCommand}') +
      ' to update'

    const boxenOptions = {
      padding: 1,
      margin: 1,
      align: 'center',
      borderColor: 'yellow',
      borderStyle: 'round',
    }

    const boxen = require('boxen')
    const pupa = require('pupa')

    const message = boxen(
      pupa(template, {
        packageName: 'gunner',
        currentVersion: pkg.version,
        latestVersion: result,
        updateCommand: 'npm i -g @codedungeon/gunner',
      }),
      boxenOptions
    )
    console.log(message)
  },
}
module.exports = inspector
