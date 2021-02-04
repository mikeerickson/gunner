/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const homedir = require('os').homedir()
const Configstore = require('configstore')
const pkgInfo = require('../../package.json')

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
    return jsonFormat ? data : JSON.parse(data)
  },
}

module.exports = config
