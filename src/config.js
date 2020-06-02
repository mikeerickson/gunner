const Configstore = require('configstore')
const pkgInfo = require('../package.json')

const conf = new Configstore(pkgInfo.name)

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
  hasKey: key => {
    let result = conf.get(key)
    return result !== undefined
  },

  set: (key, value) => {
    return conf.set(key, value)
  },
  delete: key => {
    conf.delete(key)
  }
}

module.exports = config
