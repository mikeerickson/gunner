/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { prompt, Confirm, BooleanPrompt } = require('enquirer')
const colors = require('ansi-colors')
const { cyan, dim } = require('ansi-colors')

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
