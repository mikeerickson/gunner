/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('chalk')
const { dd } = require('dumper.js')
const helpers = require('../toolbox/helpers')
const semver = require('semver')

module.exports = {
  // command to be used on cli
  name: 'test:prompt',

  // appears in CLI help
  description: 'Showcase Prompt Support',

  // when disabled, command cannot be invoked
  disabled: false,

  // when `hidden` command will not appear in `help` but can be invoked manually
  hidden: false,

  usage: `test:prompt ${colors.magenta.bold('<Resource Name>')} ${colors.blue.bold('[options]')}`,

  // if enabled, prompt will ask all questions for arguments / flags which are not `disabled`
  autoPrompt: false,

  // positional arguments (currently only support one position, multile in queue)
  arguments: {
    myArg: {
      description: 'Argument Value',
      required: true,
      prompt: {
        type: 'input',
        hint: 'what is your household title',
      },
    },
  },

  // prompt rules:
  // prompt.disable will omit question when `autoPrompt` is enabled
  // prompt disable can be overridden when using `prompt.run` and supplying question fields
  // in either case, if flag is supplied on cli, it will always be included
  // if a prompt flag has been supplied on CLI, the prompt question will not be displayed

  flags: {
    disabledPrompt: {
      aliases: ['d'],
      required: false,
      description: 'disabled prompt item',
      prompt: {
        type: 'input',
        message: 'prompt message',
        hint: 'this is disabled by default, forced display in `prompt.run` method',
        disabled: true,
      },
    },

    autocomplete: {
      // question type (boolean or string - default: string)
      type: 'string',

      // if not `autoPrompt` determines if flag must be supplied on cli
      required: false,

      // flag description
      description: 'autocomplete prompt',

      // default value (used if no prompt `initial` value)
      default: 'joelle',

      // additional help information (shows in command help)
      help: 'verbose help information',
      prompt: {
        // see list of supported prompt types
        type: 'autocomplete',
        // prompt message displayed as prompt title
        message: 'pick the leader of the house',
        choices: ['mike', 'kira', 'joelle', 'brady', 'bailey', 'trevor'],
        // appears after `message`
        hint: 'start typing to see the goods',
        // initial prompt value (if not supplied, will use `default` value if supplied)
        initial: 'kira',
      },
    },

    boolean: {
      type: 'boolean',
      description: 'boolean prompt',
      required: true,
      // prompt: {
      //   type: 'boolean',
      //   message: 'true or false',
      //   hint: 'you should answer yes',
      // },
    },

    confirm: {
      description: 'confirm prompt',
      required: false,
      prompt: {
        type: 'confirm',
        message: 'are you vaccinated',
        hint: 'you should answer yes',
      },
    },

    input: {
      description: 'input prompt',
      required: false,
      prompt: {
        type: 'input',
        message: 'enter something here',
        hint: 'can be anything you wish',
        initial: 'initial value',
      },
    },

    invisible: {
      description: 'invisible prompt',
      required: false,
      prompt: {
        type: 'invisible',
        message: 'this is an invisible prompt',
        hint: 'what you are entering is not displayed but captured',
      },
    },

    multiselect: {
      description: 'multiselect prompt',
      required: false,
      prompt: {
        type: 'multi',
        message: 'which languages do you speak (pick up to 3)',
        hint: 'press spacebar for each item',
        initial: ['english', 2],
        limit: 5,
        maxSelected: 3,
        sort: true,
        choices: [
          { value: 'pg', name: 'portguese' },
          { value: 'en', name: 'english', hint: 'english hint' },
          { value: 'sp', name: 'spanish' },
          { value: 'fr', name: 'french' },
          { value: 'gr', name: 'german' },
          { value: 'sw', name: 'swedish' },
        ],
        validate: (value) => {
          if (value.length === 0) {
            return colors.red.bold('You must enter at least one language')
          }
          return true
        },
      },
    },

    list: {
      description: 'list prompt',
      required: false,
      prompt: {
        type: 'list',
        message: 'enter kids names',
        initial: 'initial value',
        hint: 'each name separated by comma',
        validate: (value, state, item, index) => {
          if (value.length === 0) {
            return colors.red.bold('You must enter at least one item')
          }
          return true
        },
      },
    },

    number: {
      description: 'what you your favorite number',
      prompt: {
        type: 'number',
      },
    },

    numeral: {
      description: 'numeral (number) prompt',
      required: false,
      prompt: {
        type: 'numeral',
        message: 'how old are you?',
        hint: 'if you are so inclined',
        initial: 45,
        validate: (value, state, item, index) => {
          if (value <= 0) {
            return colors.red.bold('Come on, give us your age!')
          }
          return true
        },
      },
    },

    password: {
      description: 'password prompt',
      required: false,
      prompt: {
        type: 'password',
        message: 'password',
        hint: 'will echo * for each character',
      },
    },

    scale: {
      description: 'scale prompt',
      required: false,
      prompt: {
        type: 'scale',
        message: 'please rate your experience',
        margin: [0, 0, 2, 1],
        scale: [
          { name: '1', message: 'Strongly Disagree' },
          { name: '2', message: 'Disagree' },
          { name: '3', message: 'Neutral' },
          { name: '4', message: 'Agree' },
          { name: '5', message: 'Strongly Agree' },
        ],
        choices: [
          { name: 'interface', message: 'this is a cool project', initial: 0 },
          { name: 'easy', message: 'test', initial: 3 },
        ],
      },
    },

    select: {
      description: 'select prompt',
      required: false,
      prompt: {
        type: 'select',
        initial: 'item 2',
        choices: ['item 1', 'item 2', 'item 3'],
        message: 'simple choice list',
      },
    },

    snippet: {
      description: 'snippet prompt',
      required: false,
      prompt: {
        type: 'snippet',
        message: 'Fill out the fields in package.json',
        fields: [
          {
            name: 'author_name',
            message: 'Author Name',
          },
          {
            name: 'version',
            validate(value, state, item, index) {
              if (item && item.name === 'version' && !semver.valid(value)) {
                return colors.red.bold('version should be a valid semver value')
              }
              return true
            },
          },
        ],
        template: `
        {
          "name": "\${name}",
          "description": "\${description}",
          "version": "\${version}",
          "homepage": "https://github.com/\${username}/\${name}",
          "author": "\${author_name} (https://github.com/\${username})",
          "repository": "\${username}/\${name}",
          "license": "\${license:ISC}"
        }`,
      },
    },

    toggle: {
      description: 'toggle prompt',
      help: 'xxx',
      required: false,
      prompt: {
        type: 'toggle',
        message: 'simple toggle',
        hint: 'can be used as alternate to `confirm` prompt',
      },
    },

    test: {
      required: false,
      description: 'test required argument without prompt',
    },
  },

  examples: ['test:prompt MyCommand --command hello:world --description="Command Description"'],

  async execute(toolbox) {
    // override autocomplete choices
    this.flags.autocomplete.prompt.choices = ['mike', 'kira']

    // get CLI args, will be merged with answers below
    let args = helpers.getArguments(toolbox.arguments, this)

    // default prompt answers
    let answers = {}

    // show any prompts (arguments or flags marked as required with prompt data, or forced display (param 3))
    // change `autoPrompt` to false to trigger direct invokating
    if (!this.autoPrompt) {
      // override defaults and force the following prompts to be displayed
      const forcedPrompts = ['arguments.myArg', 'flags.disabledPrompt', 'flags.autocomplete', 'flags.toggle']
      let response = await toolbox.prompts.run(toolbox, this, forcedPrompts)
      answers = { ...response }
    }

    // perform any result coercion based on question type
    let result = helpers.sanitizeResults({ ...args, ...answers }, this)
    dd({ args, result })

    let keys = Object.keys(result)
    let onlyRequired = keys.length === 1 && keys[0] === 'test'
    if (!result || onlyRequired) {
      console.log('')
      toolbox.print.warning('Command Aborted\n', 'ABORT')
    } else {
      helpers.clearConsole()
      console.log('')
      toolbox.print.info('Result Data\n', 'INFO')
      console.log(result)
    }
  },
}
