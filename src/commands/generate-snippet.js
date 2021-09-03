/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { colors, helpers, print, template, path } = require('../gunner')
const clipboard = require('clipboardy')
const { dd } = require('dumper.js')

module.exports = {
  name: 'generate:snippet',
  description: 'Generates command argument or flag',
  disabled: false,
  hidden: false,
  usage: `generate:snippet ${colors.magenta('<resource>')} ${colors.blue('[options]')}`,
  usePrompts: true,
  arguments: {},
  flags: {
    name: {
      type: 'string',
      aliases: ['n'],
      description: 'Property Name',
      required: true,
      prompt: { type: 'input', hint: 'What is argument or flag property name?' },
    },
    description: {
      type: 'string',
      aliases: ['d'],
      description: 'Description',
      required: true,
      prompt: { type: 'input', hint: 'What is argument or flag description?' },
    },
    type: {
      aliases: ['t'],
      description: 'Command argument/flag type',
      required: true,
      prompt: { type: 'select', hint: 'What is data type (boolean or string)?', choices: ['boolean', 'string'] },
    },
    required: {
      type: 'any',
      aliases: ['r'],
      description: 'Command argument/flag required',
      required: true,
      prompt: { type: 'boolean', hint: 'Is this argument/flag required?' },
    },
    includePrompt: {
      type: 'any',
      aliases: ['i'],
      description: 'Command argument/flag has prompt',
      required: true,
      prompt: { type: 'confirm', hint: 'Should this argument/flag have a prompt?' },
    },
  },

  async execute(toolbox) {
    // example retrieving global option
    let quiet = toolbox.getOptionValue(toolbox.arguments, ['quiet', 'q'])

    let args = helpers.getArguments(toolbox.arguments, this)
    let answers = this.usePrompts ? await toolbox.prompts.run(toolbox, this) : []

    // merge args and answers
    let flags = { ...args, ...answers }

    let name = flags.name
    let description = flags?.description || ''
    let type = flags?.type || 'string'

    let required = flags?.required || false
    required = required === 'false' ? false : required === 'true' ? true : required

    let prompt = flags?.includePrompt || false
    prompt = prompt === 'false' ? false : prompt === 'true' ? true : prompt

    let promptData = `prompt: { type: '${
      type === 'boolean' ? 'confirm' : 'input'
    }', initial: '', hint: 'optional_hint_message' }`

    let commandFlags = Object.keys(this.flags)
    commandFlags.concat(Object.keys(this.arguments))

    if (commandFlags.includes(name)) {
      console.log('')
      print.error(`"${name}" argument/flag already exists`, 'ERROR')
      process.exit()
    }

    let data = {
      name,
      type,
      description,
      required,
      prompt,
      promptData,
    }

    let templateFilename = path.join(toolbox.app.getTemplatePath(), 'argument-flag-snippet.mustache')
    let result = template.process(templateFilename, data)
    clipboard.writeSync(result)

    console.log('')
    print.success(
      `📋 Command argument/flag "${name}" block genereated successfully and has been copied to clipboard.`,
      'SUCCESS'
    )
  },
}
