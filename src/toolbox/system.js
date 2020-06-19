var os = require('os')
var which = require('which')
const { execSync } = require('child_process')

const system = {
  run: cmd => {
    return execSync(cmd, { inherit: true }).toString()
  },
  which: app => {
    return which.sync(app)
  },
  node: () => {
    return which('node')
  },
  isWindows: () => {
    os.platform === 'win32'
  }
}

module.exports = system
