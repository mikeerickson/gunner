/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const os = require('os')
const path = require('path')
const trash = require('trash')
const fsj = require('fs-jetpack')
const fs = require('fs-extra-promise')
const { chmod, chmodSync, parse } = require('fs-chmod')
const { pushd } = require('shelljs')

const SUCCESS = 0
const ERROR = -1
const FILE_NOT_FOUND = -43

fs.eol = os.platform === 'win32' ? '\r\n' : '\n'
fs.separator = os.platform === 'win32' ? '\\' : '/'
fs.path = path

fs.homedir = () => {
  return os.homedir()
}

fs.executable = (path = '', mode = '+x') => {
  chmod(path, '+x')
    .then(() => {
      /* do nothing on success */
    })
    .catch((err) => console.error)
}

fs.chdir = (path = '') => {
  process.chdir(path)
}

fs.copy = (src = '', dest = '', options = { overwrite: true }) => {
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
    fs.mkdirSync(parentPath, { recursive: true })
  }

  fs.writeFileSync(filename, data)
}

fs.shortname = (str = '') => {
  return str.split('\\').pop().split('/').pop()
}

fs.directoryList = (directory = '', options = {}) => {
  let opts = { directoriesOnly: false, filesOnly: false, ...options }
  let addDir = !opts.filesOnly
  let addFile = !opts.directoriesOnly

  let directoryPath = path.resolve(directory)
  let result = fs.readdirSync(directoryPath)
  let matches = []
  result.forEach((item) => {
    let itemName = path.join(directoryPath, item)
    try {
      let isDir = fs.lstatSync(itemName).isDirectory()
      let isFile = fs.lstatSync(itemName).isFile()

      addDir && isDir ? matches.push(itemName) : null
      addFile && isFile ? matches.push(itemName) : null
    } catch (error) {
      console.log(error)
    }
  })
  return matches
}

module.exports = fs
