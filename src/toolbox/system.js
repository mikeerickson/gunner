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

  exec: async (cmd = null, options = []) => {
    const { stdout } = await execa(cmd, options)
    return strings.raw(stdout)
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
