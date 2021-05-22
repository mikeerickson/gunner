/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { prompt, Confirm, BooleanPrompt } = require('enquirer')
const colors = require('ansi-colors')
const { cyan, dim, danger } = require('ansi-colors')
const { dd } = require('dumper.js')
const helpers = require('./helpers')

async function input(config) {
  console.log('input prompt')
}

async function question(config) {
  console.log('question prompt (alias of input)')
}

async function confirm(config) {
  console.log('confirm prompt')
}

async function list(config) {
  console.log('list prompt')
}

async function autoComplete(config) {
  console.log('autoComplete prompt')
}

async function select(config) {
  config.type = 'select'
  return multiSelect(config)
}

async function multiSelect(config) {
  const answers = await prompt({
    type: config.type,
    name: config.name || 'choice',
    message: config.msg,
    pointer(state, choice) {
      return choice.index === state.index ? colors.cyan.bold(colors.symbols.pointer) : ' '
    },
    indicator(state, choice) {
      return choice.enabled ? ' ' + colors.green('●') : ' ' + colors.gray('o')
    },
    styles: {
      heading(msg) {
        return msg
      },
    },
    limit: config.limit || config.choices.length,
    initial: config.initial || config.choices[0],
    choices: config.choices || [],
  })
}

prompts = {
  run: async function (toolbox, command) {
    let commandName = toolbox.commandName
    let args = toolbox.arguments
    let answers = []
    let questions = []

    if (!commandName || commandName.length === 0) {
      questions.push(
        this.buildQuestion('input', 'commandName', command.arguments.name.description, {
          validate: (value, state, item, index) => {
            if (!/^[0-9a-zA-Z,-_]+$/.test(value)) {
              return colors.red.bold('Valid Characters A-Z, a-z, 0-9, -_')
            }
            return true
          },
          hint: command.arguments.name.prompt.hint,
        })
      )
    }

    let flags = Object.keys(command.flags)
    flags.forEach((flag) => {
      if (command.flags[flag]?.prompt) {
        let keys = [flag]
        keys = command.flags[flag]?.aliases ? keys.concat(command.flags[flag].aliases) : keys
        let optionValue = helpers.getOptionValue(toolbox.arguments, keys)
        let required = command.flags[flag].hasOwnProperty('required') ? command.flags[flag].required : false
        let hasPrompt = command.flags[flag].hasOwnProperty('prompt')

        if (!optionValue && required) {
          let type = command.flags[flag].prompt.hasOwnProperty('type') ? command.flags[flag].prompt.type : 'input'
          let hint = command.flags[flag].prompt.hasOwnProperty('hint') ? command.flags[flag].prompt.hint : ''
          let validate = command.flags[flag].prompt.hasOwnProperty('validate')
            ? command.flags[flag].prompt.validate
            : null

          let question = this.buildQuestion(type, flag, command.flags[flag].description, { hint, validate })
          questions.push(question)
        }
      }
    })

    if (questions.length > 0) {
      answers = await this.show(questions)
    }

    return answers
  },

  buildQuestion: function (type, name, message, alternateOptions = {}) {
    return { type, name, message, ...alternateOptions }
  },

  input: (msg, options = { initial: '' }) => {
    return prompt({ type: 'input', name: 'answer', message: msg }, options).catch((err) => console.error)
  },

  boolean: (message, initial = false) => {
    const prompt = new BooleanPrompt({ message, initial })
    return prompt.run().catch((err) => console.error)
  },

  confirm: (msg, options = { initial: false }) => {
    return prompt({ type: 'confirm', name: 'answer', message: msg }, options).catch((err) => console.error)
  },

  multiSelect: function (msg = '', choices = [], initial = '') {
    // choices: array of strings or objects
    // [{name: "item1", message: "Item 1"},{name: "item2", message: "Item 2"}]
    // initail: array or string (using name)
    // Example:
    // let items = [{name: "item1", message: "Item 1"},{name: "item2", message: "Item 2"}]
    // let result = await toolbox.prompts.multiSelect('What do you want', items, ['item2', 'item3'])
    let options = {
      choices,
      maxSelected: choices.length,
      hint: '(Use <space> to select, <return> to submit)',
      symbols: { indicator: { on: cyan('●'), off: dim.gray('●') } },
      pointer(state, choice) {
        return choice.index === state.index ? colors.green(colors.symbols.pointer) : ' '
      },
      indicator(state, choice) {
        return choice.enabled ? ' ' + colors.cyan(state.symbols.radio.on) : ' ' + colors.gray(state.symbols.radio.on)
      },
      initial,
    }
    let question = this.buildQuestion('multiselect', 'answer', msg, options)
    return this.show(question)
  },

  select: function (msg = '', choices = [], initial = '') {
    let options = {
      choices,
      maxSelected: 1,
      limit: choices.length,
      initial,
    }
    let question = this.buildQuestion('select', 'answer', msg, options)
    return this.show(question)
  },

  show: async (questions) => {
    const response = await prompt(questions).catch((err) => {
      if (err) {
        console.error(err)
      }
      return false
    })
    return response
  },
}

module.exports = prompts
