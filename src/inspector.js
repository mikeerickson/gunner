/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('ansi-colors')
const pkg = require('../package.json')
const updateNotifier = require('update-notifier')
const pleaseUpgradeNode = require('please-upgrade-node')

const inspector = {
  startup: () => {
    // inspet node version
    pleaseUpgradeNode(pkg, {
      exitCode: 0,
      message: (requiredVersion) => {
        requiredVersion = '>=' + requiredVersion
        return colors.yellow('\n 🚧 Gunner requires Node version ' + requiredVersion + '.\n')
      },
    })

    // inspet for any cli updates
    updateNotifier({ pkg }).notify()
  },
}
module.exports = inspector
