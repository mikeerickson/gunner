const os = require('os')
const fsj = require('fs-jetpack')
let fs = require('fs-extra-promise')
let path = require('path')

fs.eol = os.platform === 'win32' ? '\r\n' : '\n'
fs.separator = os.platform === 'win32' ? '\\' : '/'

fs.homedir = () => {
  return os.homedir()
}

fs.chmod = (path = '', mode = '') => {
  return fs.chmodSync(path, mode)
}

fs.copy = (src = '', dest = '', options = {}) => {
  return fsj.copy(src, dest, options)
}

fs.cwd = (opts = '') => {
  const jetParent = fsj.cwd(opts)
  return jetParent.cwd()
}

module.exports = fs
