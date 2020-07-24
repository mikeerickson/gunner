var os = require('os')
var which = require('which')
const { execSync } = require('child_process')
const exec = require('sync-exec')
const system = {
  run: (cmd) => {
    return execSync(cmd, { inherit: true }).toString()
  },
  exec: (cmd) => {
    return exec(cmd)
  },
  which: (app) => {
    return which.sync(app)
  },
  node: () => {
    return which('node')
  },
  isWindows: () => {
    os.platform === 'win32'
  },
}

module.exports = system
