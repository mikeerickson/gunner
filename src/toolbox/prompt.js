/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { prompt, Confirm, BooleanPrompt, NumberPrompt } = require('enquirer')
const helpers = require('./helpers')
const colors = require('ansi-colors')
const { cyan, dim, danger, green, blue, red } = require('ansi-colors')
const print = require('./print')

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

async function number(config) {
  const prompt = new NumberPrompt({
    name: 'number',
    message: 'Please enter a number',
  })
  return prompt
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
      return choice.enabled ? ' ' + green('●') : ' ' + gray('o')
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
  validPromptTypes: function () {
    let types = [
      'autocomplete',
      'boolean',
      'confirm',
      'input',
      'invisible',
      'list',
      'multiselect',
      'multi',
      'numeral',
      'select',
      'toggle',
    ]

    return types.sort()
  },

  validPrompt: function (prompt = null) {
    if (!prompt) return false
    let types = this.validPromptTypes()

    let validPrompt = false

    let type = prompt?.type || 'input'
    validPrompt = types.includes(type)
    if (validPrompt && (type === 'select' || type === 'multi' || type === 'multiselect')) {
      let choices = prompt?.choices || []
      validPrompt = choices
    }
    return validPrompt
  },

  run: async function (toolbox, command) {
    console.log('')
    let commandName = toolbox.commandName
    let args = toolbox.arguments
    let answers = []
    let questions = []

    if (command?.arguments?.name?.required) {
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
    }

    let flags = Object.keys(command.flags)
    flags.forEach((flag) => {
      if (command.flags[flag]?.prompt) {
        let keys = [flag]
        keys = command.flags[flag]?.aliases ? keys.concat(command.flags[flag].aliases) : keys
        let optionValue = helpers.getOptionValueEx(toolbox.arguments, keys)

        let required = command.flags[flag]?.required ? command.flags[flag].required : false

        // configure prompt if exists
        let hasPrompt = command.flags[flag]?.prompt
        let prompt = hasPrompt && command.flags[flag].prompt

        let validPrompt = this.validPrompt(prompt.type)
        if (!validPrompt) {
          toolbox.print.error(`${flag}: invalid prompt type '${prompt.type}'`, 'ERROR')
          toolbox.print.error(`        must be one of: ${this.validPromptTypes().join(', ')}`)
          console.log('')
          process.exit()
        }

        if (!optionValue && required && validPrompt) {
          let type = prompt.type
          let isNumber = type === 'number'

          type = type === 'multi' ? 'multiselect' : type
          type = type === 'boolean' ? 'confirm' : type
          type = type === 'list' ? 'input' : type

          let hint = prompt?.hint || ''
          let validate = prompt?.validate ? prompt.validate : null
          let choices = prompt?.choices ? prompt.choices : []
          let initial = prompt?.initial ? prompt.initial : []
          let limit = prompt?.limit ? prompt.limit : null
          let maxSelected = prompt?.maxSelected ? prompt.maxSelected : null
          let sort = prompt?.sort ? prompt.sort : false
          let scale = prompt?.scale ? prompt.scale : null
          let margin = prompt?.margin ? prompt.margin : null
          let fields = prompt?.fields ? prompt.fields : null
          let required = prompt?.required ? prompt.required : null
          let template = prompt?.template ? prompt.template : null
          let description = prompt?.message ? prompt.message : command.flags[flag].description

          let question = this.buildQuestion(type, flag, description, {
            hint,
            validate,
            choices,
            initial,
            limit,
            maxSelected,
            sort,
            scale,
            margin,
            fields,
            template,
            required,
          })

          questions.push(question)
        }
      }
    })

    if (questions.length > 0) {
      answers = await this.show(questions)
    }

    flags.forEach((key) => {
      if (answers?.key && command.flags[key].prompt.type === 'list') {
        answers[key] = answers[key].split(',')
      }
    })

    return answers
  },

  buildQuestion: function (type, name, message, alternateOptions = {}) {
    let defaultOptions = {
      styles: { em: colors.cyan },
      pointer(state, choice) {
        return choice.index === state.index ? colors.cyan.bold(colors.symbols.pointer) : ' '
      },
      indicator(state, choice) {
        return choice.enabled ? ' ' + colors.green('●') : ' ' + colors.gray('o')
      },
      footer(state) {
        if (state.limit < state?.choices?.length) {
          return dim('(Scroll up and down to reveal more choices)')
        }
      },
    }

    let options = { ...defaultOptions, ...alternateOptions }
    return { type, name, message, ...options }
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
      initial,
      hint: '(Use <space> to select, <return> to submit)',
      symbols: { indicator: { on: cyan('●'), off: dim.gray('●') } },
      pointer(state, choice) {
        return choice.index === state.index ? colors.green(colors.symbols.pointer) : ' '
      },
      indicator(state, choice) {
        return choice.enabled ? ' ' + colors.cyan(state.symbols.radio.on) : ' ' + colors.gray(state.symbols.radio.on)
      },
      format() {
        return prompt.input + ' ' + prompt.styles.muted(prompt.state.hint)
      },
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
