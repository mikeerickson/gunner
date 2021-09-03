/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const util = require('util')
const { colors, helpers, prompt, strings } = require('../gunner')
const semver = require('semver')
var bump = require('bump-regex')

let bumpVersion = util.promisify(bump)

module.exports = {
  name: 'quick:prompt',
  description: 'Simple Quick Prompt',
  usage: 'quick:prompt',
  arguments: {},
  flags: {},
  hidden: true,
  async execute(toolbox) {
    let bumpResult = await bumpVersion({ str: 'version: 0.1.2', type: 'patch' })

    let pad = (value, length = 12, padText = ' ') => {
      return value.padEnd(length, padText)
    }

    let formatValidSemver = (currentVersion) => {
      const parts = currentVersion.split('.')
      let [major, minor, patch, remainder] = parts
      minor = minor ? minor : '0'
      patch = patch ? patch : '0'
      remainder = remainder ? remainder : ''
      return `${major}.${minor}.${patch}${remainder}`
    }

    let incrementVersion = async (baseVersion = '', type = 'patch') => {
      let result = await bumpVersion({ str: `version: "${formatValidSemver(baseVersion)}"`, type })
      let [major, minor, patch, remainder] = result.new.split('.')

      // apply color to changed part
      major = type === 'major' ? colors.cyan(major) : major
      minor = type === 'minor' ? colors.cyan(minor) : minor
      patch = type === 'patch' ? colors.cyan(patch) : patch
      remainder = remainder ? '.' + remainder : ''

      return `${major}.${minor}.${patch}`
    }

    let currentVersion = '1.0'

    let nextMajor = await incrementVersion(currentVersion, 'major')
    let nextMinor = await incrementVersion(currentVersion, 'minor')
    let nextPatch = await incrementVersion(currentVersion, 'patch')
    let choices = [
      { name: `${pad('major')} ${nextMajor}`, value: nextMajor },
      { name: `${pad('minor')} ${nextMinor}`, value: nextMinor },
      { name: `${pad('patch')} ${nextPatch}`, value: nextPatch },
      '_______________',
      'Other (Specify)',
    ]

    let result = await prompt.select('Select semver increment or specify new version', choices, '', {
      hint: '(Use arrow keys)',
    })

    if (result) {
      let answer = choices.filter((item) => {
        return strings.raw(item.name) === strings.raw(result.answer)
      })

      let version = ''
      if (answer.length > 0) {
        if (answer[0].value === 'Other (Specify)') {
          console.log('show imput')
          answer = await prompt.input('Enter version', {
            validate(value, state, item, index) {
              if (!semver.valid(value)) {
                return colors.red.bold('version should be a valid semver value')
              }
              if (!semver.gt(value, currentVersion)) {
                return colors.red.bold(`version must be greater than ${currentVersion}`)
              }
              return true
            },
          })
          version = answer.answer
        } else {
          version = answer[0].value
        }
      }
      console.log('')
      toolbox.print.info(`Selected Value: ${version}`)
    }
  },
}
