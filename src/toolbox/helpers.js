/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const fs = require('fs-extra')
const dotProp = require('dot-prop')
const { prompt } = require('enquirer')
const promptColors = require('ansi-colors')
const clearConsole = require('clear-any-console')

const pkgInfo = require('../../package.json')
const { dd } = require('dumper.js')

class Helpers {
  constructor(param = null) {}

  getPackageName() {
    return pkgInfo.packageName
  }

  getPackageVersion(addBuild = false) {
    const build = addBuild ? ` (${this.getPackageBuild()})` : ''
    return pkgInfo.version + build
  }

  getPackageBuild() {
    return pkgInfo.build
  }

  getPackageInfo(key) {
    return pkgInfo[key]
  }

  getLogFilename(location = 'logs') {
    let logFilePath = path.join(location)
  }

  argumentHasOption(args, needles) {
    if (typeof needles === 'undefined') {
      return false
    }
    let items = typeof needles === 'string' ? needles.split(',') : needles
    for (let i = 0; i < items.length; i++) {
      const element = items[i]?.replace(/-/gi, '')
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

  getFlagValue(args = null, options = null, key = null, defaultValue = null) {
    let flags = [key]
    if (options.hasOwnProperty(key) && options[key].hasOwnProperty('aliases')) {
      flags = flags.concat(options[key].aliases)
    }

    return this.getOptionValueEx(args, flags, defaultValue)
  }

  getOptionValue(args = null, options = null, key = null, defaultValue = null) {
    let flags = [key]
    if (options.hasOwnProperty(key) && options[key].hasOwnProperty('aliases')) {
      flags = flags.concat(options[key].aliases)
    }

    return this.getOptionValueEx(args, flags, defaultValue)
  }

  getOptionValueEx(args, optName, defaultValue = null) {
    if (this.argumentHasOption(args, optName)) {
      let options = typeof optName === 'string' ? [optName] : optName
      for (let i = 0; i < options.length; i++) {
        let option = options[i].replace(/-/gi, '')
        if (args.hasOwnProperty(option)) {
          return args[option]
        }
      }
      return defaultValue
    }
    return defaultValue
  }

  getArguments(cliArgs = null, commandArgsFlags = null, options = { initializeNullValues: false }) {
    let result = {}

    if (cliArgs && commandArgsFlags) {
      if (commandArgsFlags?.flags) {
        Object.keys(commandArgsFlags?.flags).forEach((key) => {
          let type = commandArgsFlags.flags[key]?.type ? commandArgsFlags.flags[key].type : null
          let value = this.getOptionValue(cliArgs, commandArgsFlags.flags, key)
          if (value === null) {
            let defaultValue = null
            if (commandArgsFlags.flags[key]?.initial) {
              defaultValue = commandArgsFlags.flags[key]?.initial
            }
            value = defaultValue
          }

          if (type === 'boolean' && value === 'false') {
            value = false
          }
          result[key] = value
        })
      }
      if (commandArgsFlags?.arguments) {
        Object.keys(commandArgsFlags?.arguments).forEach((key) => {
          let type = commandArgsFlags.arguments[key]?.type ? commandArgsFlags.arguments[key].type : null
          let value = this.getOptionValue(cliArgs, commandArgsFlags.arguments, key)
          if (value === null) {
            let defaultValue = null
            if (commandArgsFlags.arguments[key]?.initial) {
              defaultValue = commandArgsFlags.arguments[key]?.initial
            }
            value = defaultValue
          }
          if (type === 'boolean' && value === 'false') {
            value = false
          }

          result[key] = value
        })
      }
    } else {
      return { ...cliArgs }
    }

    return result
  }

  setDefaultFlags(cliArgs = null, commandFlags = null, options = { initializeNullValues: true }) {
    let result = {}

    if (cliArgs && commandFlags) {
      Object.keys(commandFlags).forEach((key) => {
        let type = commandFlags[key]?.type ? commandFlags[key].type : null
        let value = this.getOptionValue(cliArgs, commandFlags, key)
        if (value === null) {
          let defaultValue = null
          if (commandFlags[key]?.initial) {
            defaultValue = commandFlags[key]?.initial
          }
          value = defaultValue
        }

        if (type === 'boolean' && value === 'false') {
          value = false
        }
        result[key] = value
      })
    } else {
      return { ...cliArgs }
    }

    return result
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

  isEmptyObject(object = null) {
    if (!object) return true
    return Object.keys(object).length === 0
  }

  getProp(props = nll, value = null) {
    return dotProp.get(props, value)
  }

  sanitizeResults(result = null, command = null) {
    let data = {}
    Object.keys(result).forEach((key) => {
      let type = command.flags[key]?.prompt?.type
      if (result?.hasOwnProperty(key) && type === 'list') {
        if (typeof result[key] === 'string') {
          data[key] = result[key].split(',')
        } else {
          if (result[key]) {
            data[key] = result[key]
          }
        }
        if (data[key]) {
          data[key] = data[key].map((item) => item.trim())
        }
      } else {
        if (result[key] || type === 'toggle') {
          if (type === 'toggle') {
            if (result[key] !== null) {
              data[key] = result[key]
              if (data[key] === 'false') {
                data[key] = false
              }
            }
          } else {
            if (type === 'confirm') {
              data[key] = result[key] === 'true' || result[key]
              if (data[key] === 'false') {
                data[key] = false
              }
            } else {
              data[key] = result[key]
            }
          }
        }
      }
    })

    return Object.keys(data).length > 0 ? data : false
  }

  clearConsole() {
    clearConsole()
  }
}

module.exports = new Helpers()
