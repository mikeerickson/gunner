/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const os = require('os')
const which = require('which')
const { exec, execSync } = require('child_process')

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
