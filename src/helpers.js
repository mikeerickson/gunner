const pkgInfo = require('../package.json')
const fs = require('fs-extra')
const dotProp = require('dot-prop')
const colors = require('ansi-colors')
const { prompt } = require('enquirer')

class Helpers {
  constructor() {
    console.log('Initialize CLI Helper')
  }

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

  getTagline() {
    return pkgInfo.tagline
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

  compile(template = '', data = {}) {
    Object.keys(data).map(key => {
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
      styles: { em: colors.cyan },
      pointer(state, choice) {
        return choice.index === state.index ? colors.cyan.bold(colors.symbols.pointer) : ' '
      },
      indicator(state, choice) {
        return choice.enabled ? ' ' + colors.green('●') : ' ' + colors.gray('o')
      }
    }

    let options = { ...defaultOptions, ...alternateOptions }
    return { type, name, message, ...options }
  }

  promptRequest(questions = [], resolve, reject) {
    prompt(questions)
      .then(answers => {
        resolve(answers)
      })
      .catch(err => {
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
