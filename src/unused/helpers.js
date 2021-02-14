/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const fs = require('fs-extra')
const dotProp = require('dot-prop')
const { prompt } = require('enquirer')
const promptColors = require('ansi-colors')

const pkgInfo = require('../../package.json')

class Helpers {
  constructor() {}

  getPackageName() {
    return pkgInfo.packageName
  }

  getPackageVersion(addBuild = false) {
    const build = addBuild ? ' build ' + this.getPackageBuild() : ''
    return pkgInfo.version + build
  }

  getPackageBuild() {
    return pkgInfo.build
  }

  getPackageInfo(key) {
    return pkgInfo[key]
  }

  argumentHasOption(args, needles) {
    if (typeof needles === 'undefined') {
      return false
    }
    let items = typeof needles === 'string' ? needles.split(',') : needles
    for (let i = 0; i < items.length; i++) {
      const element = items[i].replace(/-/gi, '')
      if (args.hasOwnProperty(element)) {
        return true
      }
    }
    return false
  }

  // simple merging
  // see template.js 'mergeFile' for more verbose implemenation using .mustache syntax
  merge(template = '', data = {}) {
    Object.keys(data).map((key) => {
      let regex = new RegExp(`<%${key}%>`, 'gi')
      template = template.replace(regex, data[key])
    })
    return template
  }

  parseArguments(cliCommand) {
    return require('yargs-parser')(cliCommand)
  }

  getOptionValue(args, optName) {
    if (this.argumentHasOption(args, optName)) {
      let options = typeof optName === 'string' ? [optName] : optName
      for (let i = 0; i < options.length; i++) {
        let option = options[i].replace(/-/gi, '')
        if (args.hasOwnProperty(option)) {
          return args[option]
        }
      }
      return ''
    }
    return ''
  }

  buildQuestion(type, name, message, alternateOptions = {}) {
    let defaultOptions = {
      styles: { em: promptColors.cyan },
      pointer(state, choice) {
        return choice.index === state.index ? promptColors.cyan.bold(promptColors.symbols.pointer) : ' '
      },
      indicator(state, choice) {
        return choice.enabled ? ' ' + promptColors.green('●') : ' ' + promptColors.gray('o')
      },
    }

    let options = { ...defaultOptions, ...alternateOptions }
    return { type, name, message, ...options }
  }

  promptRequest(questions = [], resolve, reject) {
    prompt(questions)
      .then((answers) => {
        resolve(answers)
      })
      .catch((err) => {
        reject(err)
      })
  }

  updatePackageJson(filename = '', key = '', value = '') {
    if (fs.existsSync(filename)) {
      let pkgInfo = require(filename)
      dotProp.set(pkgInfo, key, value)
      try {
        fs.writeFileSync(filename, JSON.stringify(pkgInfo, null, 2))
        return true
      } catch (e) {
        console.error(e)
      }
    } else {
      return false
    }
  }
}

module.exports = Helpers
