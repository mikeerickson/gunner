/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { exec, execSync } = require('child_process')
const execa = require('execa')
const strings = require('./strings')
const which = require('which')

const system = {
  run: (cmd, showConsoleOutput = false) => {
    if (showConsoleOutput) {
      return execSync(cmd, { stdio: 'inherit', inherit: true })
    }
    return execSync(cmd, { inherit: true }).toString()
  },

  exec: async (cmd = null, params = []) => {
    try {
      const subprocess = execa(cmd, params, { env: { FORCE_COLOR: 'true' } })
      subprocess.stdout.pipe(process.stdout)
      const { stdout, stderr } = await subprocess
      return !stderr ? 'SUCCESS' : 'FAIL'
    } catch (error) {
      return 'FAIL'
    }
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

  sleep: (ms = 100) => {
    return new Promise((resolve) => setTimeout(resolve, ms))
  },
}

module.exports = system
