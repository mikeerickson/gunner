/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('chalk')
const { dd } = require('dumper.js')
const helpers = require('../toolbox/helpers')
const semver = require('semver')

module.exports = {
  name: 'test:prompt',
  description: 'Showcase Prompt Support',
  disabled: false,
  hidden: false,
  usage: `test:prompt ${colors.blue.bold('[Resource Name]')} ${colors.magenta.bold('<flags>')}`,
  usePrompts: false,
  arguments: {
    myArg: {
      description: 'Argument Value',
      required: false,
      prompt: {
        type: 'input',
        hint: 'what is your household title',
      },
    },
  },

  flags: {
    disabledPrompt: {
      aliases: ['d'],
      required: false,
      description: 'disabled prompt item',
      default: 'mike',
      prompt: {
        type: 'input',
        message: 'prompt message',
        hint: 'this is disabled by default, enabled `execute` method',
        disabled: true,
        initial: 'x',
      },
    },

    autocomplete: {
      required: false,
      description: 'autocomplete prompt',
      help: 'verbose help information',
      prompt: {
        type: 'autocomplete',
        message: 'pick the leader of the house',
        choices: ['mike', 'kira', 'joelle', 'brady', 'bailey', 'trevor'],
        hint: 'start typing to see the goods',
      },
    },

    boolean: {
      description: 'boolean prompt',
      required: false,
      prompt: {
        type: 'boolean',
        message: 'true or false',
        hint: 'you should answer yes',
      },
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
      required: false,
      prompt: {
        type: 'toggle',
        message: 'simple toggle',
      },
    },

    test: {
      required: false,
      description: 'test required argument without prompt',
    },
  },

  examples: ['test:prompt MyCommand --command hello:world --description="Command Description"'],

  async execute(toolbox) {
    // override default for testing
    this.flags.disabledPrompt.prompt.disabled = false

    // override autocomplete choices
    this.flags.autocomplete.prompt.choices = ['mike', 'kira']
    // get CLI args, will be merged with answers below
    let args = helpers.getArguments(toolbox.arguments, this)

    // show any prompts (arguments or flags marked as required with prompt data)
    let answers = await toolbox.prompts.run(toolbox, this)

    let result = helpers.sanitizeResults({ ...args, ...answers }, this)

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
