/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const os = require('os')
const path = require('path')
const trash = require('trash')
const fsj = require('fs-jetpack')
const fs = require('fs-extra-promise')

fs.eol = os.platform === 'win32' ? '\r\n' : '\n'
fs.separator = os.platform === 'win32' ? '\\' : '/'
fs.path = path

fs.homedir = () => {
  return os.homedir()
}

fs.chmod = (path = '', mode = '') => {
  return fs.chmodSync(path, mode)
}

fs.chdir = (path) => {
  process.chdir(path)
}

fs.copy = (src = '', dest = '', options = {}) => {
  return fsj.copy(src, dest, options)
}

fs.cwd = (opts = '') => {
  const jetParent = fsj.cwd(opts)
  return jetParent.cwd()
}

fs.delete = (filename = '') => {
  if (fs.existsSync(filename)) {
    fs.unlinkSync(filename)
  }
}

fs.trash = (filename = '') => {
  if (fs.existsSync(filename)) {
    trash(filename)
  }
}

module.exports = fs
