/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const os = require('os')
const path = require('path')
const trash = require('trash')
const fsj = require('fs-jetpack')
const fs = require('fs-extra-promise')

const SUCCESS = 0
const ERROR = -1
const FILE_NOT_FOUND = -43

fs.eol = os.platform === 'win32' ? '\r\n' : '\n'
fs.separator = os.platform === 'win32' ? '\\' : '/'
fs.path = path

fs.homedir = () => {
  return os.homedir()
}

fs.chmod = (path = '', mode = '') => {
  return fs.chmodSync(path, mode)
}

fs.chdir = (path = '') => {
  process.chdir(path)
}

fs.copy = (src = '', dest = '', options = {}) => {
  return fsj.copy(src, dest, options)
}

fs.pwd = (opts = '') => {
  return __dirname
}

fs.cwd = (opts = '') => {
  const jetParent = fsj.cwd(opts)
  return jetParent.cwd()
}

fs.delete = (path = '') => {
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isDirectory()) {
      fs.rmdir(path)
    } else {
      fs.unlinkSync(path)
    }
  }
}

fs.rmdir = (dir = '') => {
  if (fs.existsSync(dir)) {
    try {
      fs.rmdirSync(dir, { recursive: true })
    } catch (err) {
      console.error(`Error while deleting ${dir}.`)
    }
  }
}

fs.exists = (path = '') => {
  return fs.existsSync(path)
}

fs.trash = (filename = '') => {
  if (fs.existsSync(filename)) {
    trash(filename)
  }
}

fs.read = (filename) => {
  return fs.readFileSync(filename, 'utf8')
}

fs.write = (filename, data, options = { overwrite: false }) => {
  if (fs.existsSync(filename)) {
    if (options.overwrite) {
      fs.unlinkSync(filename)
    }
  }
  let parentPath = path.dirname(filename)
  if (!fs.existsSync(parentPath)) {
    fs.mkdirSync(parentPath)
  }

  fs.writeFileSync(filename, data)
}

module.exports = fs
