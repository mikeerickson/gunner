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
        return colors.yellow('\n 🚧 Gunner requires Node version ' + requiredVersion + ' or greater.')
      },
    })

    // inspet for any cli updates
    updateNotifier({ pkg }).notify()
  },
}
module.exports = inspector
