const Configstore = require('configstore')
const pkgInfo = require('../../package.json')
const homedir = require('os').homedir()

const conf = new Configstore(pkgInfo.name)
const fs = require('fs-extra-promise')
const config = {
  get: (key, defaultValue) => {
    let result = conf.get(key)
    if (result === undefined) {
      if (defaultValue !== undefined) {
        conf.set(key, defaultValue)
        result = defaultValue
      }
      return result
    }
    return result
  },
  hasKey: (key) => {
    let result = conf.get(key)
    return result !== undefined
  },
  set: (key, value) => {
    return conf.set(key, value)
  },
  delete: (key) => {
    conf.delete(key)
  },
  configFilename() {
    return `${homedir}/.config/configstore/${pkgInfo.name}.json`
  },
  getConfigData(jsonFormat = false) {
    let data = fs.readFileSync(this.configFilename(), 'utf-8')
    return jsonFormat ? JSON.parse(data) : data
  },
}

module.exports = config