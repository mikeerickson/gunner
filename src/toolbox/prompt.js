/*eslint-disable */

/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { prompt } = require('enquirer')

const print = require('./print')
const arrays = require('./arrays')
const helpers = require('./helpers')
const colors = require('ansi-colors')
const messenger = require('@codedungeon/messenger')
const { cyan, dim, danger, green, blue, red } = require('ansi-colors')
const { dd } = require('dumper.js')

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

  run: async function (toolbox, command, runPrompts = null) {
    let argKeys = Object.keys(toolbox.arguments)
    argKeys = arrays.deleteByValue(argKeys, 'log')
    argKeys = arrays.deleteByValue(argKeys, 'overwrite')
    argKeys = arrays.deleteByValue(argKeys, 'o')
    argKeys = arrays.deleteByValue(argKeys, 'quiet')

    let promptAll = toolbox.commandName.length === 0 && argKeys.length === 0

    console.log('')
    let commandName = toolbox.commandName
    let args = toolbox.arguments
    let answers = []
    let questions = []
    let name = ''

    if (command.hasOwnProperty('arguments') && Object.keys(command.arguments).length > 0) {
      name = Object.keys(command.arguments).length > 0 ? Object.keys(command.arguments)[0] : null
      let disabled = command.arguments[name].prompt?.disabled ? command.arguments[name].prompt.disabled : false

      if (disabled && runPrompts && runPrompts.includes(`arguments.${name}`)) {
        disabled = false
      }
      if (!name) {
        return
      }

      if (command?.arguments[name]?.required || !disabled) {
        if (!commandName || commandName.length === 0) {
          let argumentKeys = Object.keys(command.arguments[name])
          if (argumentKeys.length === 0) {
            return
          }
          let type = command.arguments[name]?.prompt?.type || null
          if (type === 'input') {
            questions.push(
              this.buildQuestion('input', name, command.arguments[name].description, {
                validate: (value, state, item, index) => {
                  if (!/^[0-9a-zA-Z,-_]+$/.test(value)) {
                    return colors.red.bold('Valid Characters A-Z, a-z, 0-9, -_')
                  }
                  return true
                },
                hint: command.arguments[name].prompt.hint,
              })
            )
          } else {
            let argument = command.arguments[name]

            let type = argument.prompt.type
            let message = argument.prompt.hasOwnProperty('message') ? argument.prompt.message : argument.description
            let hint = message === argument.prompt.hint ? '' : argument.prompt?.hint ? argument.prompt?.hint : ''

            let choices = argument.hasOwnProperty('choices')
              ? argument.choices
              : argument.prompt.hasOwnProperty('choices')
              ? argument.prompt.choices
              : []

            let options = { type, message, choices, hint }

            questions.push(this.buildQuestion(type, 'commandName', argument.description, options))
          }
        }
      }
    }

    let flags = Object.keys(command.flags)

    flags.forEach((flag) => {
      let disabled = command.flags[flag].prompt?.disabled ? command.flags[flag].prompt.disabled : false

      if (disabled && runPrompts && runPrompts.includes(`flags.${flag}`)) {
        disabled = false
      }

      if (command.flags[flag]?.prompt && !disabled) {
        let keys = [flag]
        keys = command.flags[flag]?.aliases ? keys.concat(command.flags[flag].aliases) : keys
        let optionValue = helpers.getOptionValueEx(toolbox.arguments, keys)

        let required = command.flags[flag]?.required ? command.flags[flag].required : false
        if (!required) {
          required = runPrompts && runPrompts.includes(`flags.${flag}`)
        }

        if (
          !required &&
          command.flags[flag].hasOwnProperty('prompt') &&
          command.flags[flag].prompt.hasOwnProperty('disabled')
        ) {
          required = !command.flags[flag].prompt.disabled
        }

        if (!required && command.autoPrompt) {
          if (command.flags[flag].hasOwnProperty('prompt')) {
            required = command.flags[flag].prompt?.disabled ? !command.flags[flag].prompt.disabled : true
          }
        }

        if (promptAll) {
          required = true
        }
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
          type = type === 'choice' ? 'select' : type

          let hint = prompt?.hint || ''
          let validate = prompt?.validate ? prompt.validate : null
          let choices = prompt?.choices ? prompt.choices : []
          if (choices.length === 0 && command.flags[flag].choices) {
            choices = [...command.flags[flag].choices]
          }
          let initial = command.flags[flag]?.initial ? command.flags[flag].initial : null

          if (!initial) {
            initial = prompt?.initial ? prompt.initial : false
          }

          if (!initial) {
            initial = command.flags[flag]?.default ? command.flags[flag].default : null
          }

          if (!initial) {
            if (type === 'input') {
              initial = ''
            }
          }

          let limit = prompt?.limit ? prompt.limit : null
          let maxSelected = prompt?.maxSelected ? prompt.maxSelected : null
          let sort = prompt?.sort ? prompt.sort : false
          let scale = prompt?.scale ? prompt.scale : null
          let margin = prompt?.margin ? prompt.margin : null
          let fields = prompt?.fields ? prompt.fields : null
          let required = prompt?.required ? prompt.required : null

          if (!required) {
            required = command.flags[flag].hasOwnProperty('required') ? command.flags[flag].required : null
          }

          let template = prompt?.template ? prompt.template : null
          let description = prompt?.message ? prompt.message : command.flags[flag].description

          if (!disabled) {
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
      }
    })

    if (questions.length > 0) {
      answers = await this.show(questions)
      let args = { ...answers }
      delete args.commandName

      toolbox.logToFile(command.name, toolbox.commandName || answers.commandName, args)
    }

    if (!answers && !toolbox.arguments?.quiet) {
      console.log('')
      messenger.warning('Command Aborted\n', 'ABORT')
      process.exit()
    }

    flags.forEach((key) => {
      if (answers?.key && command.flags[key].prompt.type === 'list') {
        answers[key] = answers[key].split(',')
      }
    })

    return answers
  },

  buildQuestion: function (type = '', name = '', message = '', alternateOptions = {}) {
    // type (input type)
    // name (prompt name)
    // message (prompt messsage)
    type = type === 'multi' ? 'multiselect' : type
    type = type === 'boolean' ? 'confirm' : type
    type = type === 'number' ? 'numeral' : type
    type = type === 'choice' ? 'select' : type

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
    options.type = type

    if (type === 'numeral') {
      // for whatever reason, the actual initl value for numbers is causing issues
      // thus I have to +0 to make it work (and perform typeof check verified it is 'number')
      // but it still didnt work
      options.initial = options.initial + 0
      return { type, name, message, ...options }
    }
    return { type, name, message, ...options }
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

  /*-------------------------------------------------------------------------------------------
   * Prompt Methods
   * Used for one of prompts, if you need a series, use the `buildQuestion` interface (see docs).
   * -----------------------------------------------------------------------------------------*/

  autocomplete(message = null, options = {}) {
    return prompt({ type: 'autocomplete', name: 'answer', message }, options).catch((err) => console.error)
  },

  boolean: (message, initial = false) => {
    let options = { initial }
    return prompt({ type: 'confirm', name: 'answer', message }, options).catch((err) => console.error)
  },

  confirm: (msg, options = { initial: false }) => {
    return prompt({ type: 'confirm', name: 'answer', message: msg }, options).catch((err) => console.error)
  },

  input: (msg, options = { initial: '' }) => {
    return prompt({ type: 'input', name: 'answer', message: msg }, options).catch((err) => console.error)
  },

  list: (msg, options = { hint: 'separate by comma' }) => {
    return prompt({ type: 'list', name: 'answer', message: msg }, options).catch((err) => console.error)
  },

  // NOTE: This method is replicated to `multiSelect`, if changed duplicate to `multiSelect` method
  multi: (msg, options = { initial: false }) => {
    let maxSelected = options?.maxSelected ? options.maxSelected : options.choices.length
    if (maxSelected > options.choices.length) {
      maxSelected = options.choices.length
    }

    let defOptions = {
      choices: [],
      maxSelected,
      initial: [],
      hint: '(Use <space> to select, <return> to submit)',
      styles: { em: colors.cyan },
      symbols: { indicator: { on: cyan('●'), off: dim.gray('●') } },
      pointer(state, choice) {
        return choice.index === state.index ? colors.green(colors.symbols.pointer) : ' '
      },
      indicator(state, choice) {
        return choice.enabled
          ? ' ' + colors.cyan.bold(state.symbols.radio.on)
          : ' ' + colors.gray.bold(state.symbols.radio.on)
      },
      format() {
        if (this.maxSelected === this.choices.length) {
          return ''
        } else {
          let n = this.maxSelected - this.selected.length
          let s = n === 0 || n > 1 ? 's' : ''
          let msg = n === 0 ? 'You have reached maximum selection' : `You may select ${n} more item${s}`
          return msg
        }
      },
    }

    let multiOptions = { ...defOptions, ...options }
    multiOptions.maxSelected = maxSelected

    return prompt({ type: 'multiselect', name: 'answer', message: msg }, multiOptions).catch((err) => console.log(''))
  },

  // NOTE: This is a physical copy of `multi` method.  If changed, replicate here
  multiSelect: (msg, options = { initial: false }) => {
    let maxSelected = options?.maxSelected ? options.maxSelected : options.choices.length
    if (maxSelected > options.choices.length) {
      maxSelected = options.choices.length
    }

    let defOptions = {
      choices: [],
      maxSelected,
      initial: [],
      hint: '(Use <space> to select, <return> to submit)',
      styles: { em: colors.cyan },
      symbols: { indicator: { on: cyan('●'), off: dim.gray('●') } },
      pointer(state, choice) {
        return choice.index === state.index ? colors.green(colors.symbols.pointer) : ' '
      },
      indicator(state, choice) {
        return choice.enabled
          ? ' ' + colors.cyan.bold(state.symbols.radio.on)
          : ' ' + colors.gray.bold(state.symbols.radio.on)
      },
      format() {
        if (this.maxSelected === this.choices.length) {
          return ''
        } else {
          let n = this.maxSelected - this.selected.length
          let s = n === 0 || n > 1 ? 's' : ''
          let msg = n === 0 ? 'You have reached maximum selection' : `You may select ${n} more item${s}`
          return msg
        }
      },
    }

    let multiOptions = { ...defOptions, ...options }
    multiOptions.maxSelected = maxSelected

    return prompt({ type: 'multiselect', name: 'answer', message: msg }, multiOptions).catch((err) => console.log(''))
  },

  numeral: (msg = '', initialValue = 0, options = {}) => {
    let opts = { ...{ initial: initialValue }, ...options }
    return prompt({ type: 'numeral', name: 'answer', message: msg }, opts).catch((err) => console.error)
  },

  number: (msg = '', initialValue = 0, options = {}) => {
    let opts = { ...{ initial: initialValue }, ...options }
    return prompt({ type: 'numeral', name: 'answer', message: msg }, opts).catch((err) => console.error)
  },

  password: (msg = '', options = {}) => {
    return prompt({ type: 'password', name: 'password', message: msg }, options).catch((err) => console.error)
  },

  select: function (msg = '', choices = [], initValue = '', options = {}) {
    let initial = Array.isArray(initValue) ? initValue[0] : initValue
    let format = options.hasOwnProperty('format') ? options.format : () => {}

    let defOptions = {
      choices,
      format,
      hint: '(Use arrow keys, <return> to submit)',
      initial,
      styles: { em: colors.cyan },
      indicator(state, choice) {
        return choice.enabled ? ' ' + colors.green('●') : ' ' + colors.gray('o')
      },
    }

    let multiOptions = { ...defOptions, ...options }

    return prompt({ type: 'select', name: 'answer', message: msg }, multiOptions).catch((err) => console.log(''))
  },

  toggle: (msg = '', initialValue = 0, options = {}) => {
    let opts = { ...{ initial: initialValue }, ...options }
    return prompt({ type: 'toggle', name: 'answer', message: msg }, opts).catch((err) => console.error)
  },
}

module.exports = prompts
