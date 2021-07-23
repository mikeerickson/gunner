const colors = require('chalk')
const print = require('../toolbox/print')
const helpers = require('../toolbox/helpers')

module.exports = {
  name: 'test',
  description: 'test command (not in distribution)',
  disabled: false,
  hidden: false,
  usage: `test ${colors.magenta('<resource>')} ${colors.blue('[options]')}`,
  usePrompts: false,
  arguments: {
    name: {
      description: 'Sub Command',
      required: true,
      prompt: {
        type: 'input',
        hint: '(as it will be saved on disk)',
      },
    },
  },
  flags: {
    // example flag, adjust accordingly
    test: {
      aliases: ['t'],
      description: 'Use Tests',
      required: false,
      prompt: { type: 'confirm', hint: 'Would you like to create tests?' },
    },
  },

  async execute(toolbox) {
    console.log('')
    // example retrieving global option
    let quiet = toolbox.getOptionValue(toolbox.arguments, ['quiet', 'q'])

    let args = helpers.getArguments(toolbox.arguments, this.flags)
    let answers = this.usePrompts ? await toolbox.prompts.run(toolbox, this) : []

    // merge args and answers
    let flags = { ...args, ...answers }
    console.log({
      subCommand: toolbox.commandName || flags.commandName,
      arguments: toolbox.arguments,
      flags,
    })

    console.log('')
  },
}
