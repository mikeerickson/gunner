/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('chalk')
const { dd } = require('dumper.js')

module.exports = {
  name: 'make:command',
  description: 'Create new command',
  usage: `make:command ${colors.blue('[Filename]')} ${colors.magenta('<flags>')}`,
  showPrompts: true,
  arguments: {
    name: {
      description: 'Resource Filename',
      required: true,
      help: 'You must supply Command Name (as it will be saved on disk)',
      prompt: {
        type: 'input',
        hint: 'Command Name (as it will be saved on disk)',
      },
    },
  },
  flags: {
    name: {
      aliases: ['n'],
      description: 'Command Name',
      required: true,
      prompt: {
        type: 'input',
        hint: 'eg make:command',
        validate: (value, state, item, index) => {
          return value.length > 0
        },
      },
    },
    description: { aliases: ['s'], description: 'Command Description', required: false },
    hidden: { aliases: ['i'], description: 'Command Hidden', required: false },
    arguments: { aliases: ['a'], description: 'Include Arguments Block', required: false },
    template: { aliases: ['t'], description: 'Custom Template', required: false },
    noComments: {
      aliases: ['n'],
      description: 'Suppress Command Documentation',
      required: false,
      prompt: {
        type: 'confirm',
        hint: 'Show Confirmation Messages',
      },
    },
  },
  examples: ['make:command HelloWorld --name hello:world --description="Command Description"'],

  async execute(toolbox) {
    let questions = []
    let noComment = toolbox.getOptionValue(toolbox.arguments, ['noComment', 'n'])
    let answers = this.showPrompts ? await toolbox.prompts.run(toolbox, this) : []

    let commandName = toolbox.commandName || answers.commandName
    let name = toolbox.arguments.name || answers.name
    let description = toolbox.arguments.description || answers.description || ''
    let showArguments = toolbox.arguments.arguments || toolbox.arguments.showArguments || answers.showArguments || false
    let hidden = toolbox.arguments.hidden || answers.hidden || false
    let template = toolbox.arguments.template || ''

    if (!(commandName && name)) {
      console.log('')
      toolbox.print.warn('Command Creation Cancelled', 'WARNING')
      console.log('')
      process.exit(0)
    }

    if (!toolbox.strings.validName(commandName)) {
      console.log('')
      toolbox.print.error(`🚫  Invalid Name:  ${commandName}`)
      toolbox.print.warn('    Valid Characters A-Z, a-z, 0-9, -\n')
      process.exit(0)
    }

    let data = {
      name: commandName,
      showArguments,
      description,
      template,
      hidden,
      noComment: !noComment,
    }

    console.log('')
    console.log('')

    toolbox.commandName = data.name

    let templateFilename = ''
    if (data.template.length > 0) {
      templateFilename = toolbox.path.resolve(data.template)
    } else {
      templateFilename = toolbox.path.join(toolbox.app.getTemplatePath(), 'make-command.mustache')
    }
    if (toolbox.filesystem.existsSync(templateFilename)) {
      let templateData = toolbox.template.process(templateFilename, data)
      let projectCommandPath = toolbox.path.join(toolbox.app.getProjectPath(), 'src', 'commands')

      if (!toolbox.filesystem.existsSync(projectCommandPath)) {
        toolbox.filesystem.mkdirSync(projectCommandPath, { recursive: true })
        toolbox.print.info(toolbox.colors.bold('==> Creating Project `commands` Directory'))
      }
      // check if command name has file extension, if not use ".js"
      let fileExtension = toolbox.path.extname(toolbox.commandName)
      fileExtension = fileExtension.length > 0 ? '' : '.js'

      let commandFilename = toolbox.path.join(projectCommandPath, toolbox.commandName + fileExtension)
      let overwrite = toolbox.getOptionValue(toolbox.arguments, ['overwrite', '-o'])

      if (overwrite) {
        toolbox.filesystem.existsSync(commandFilename) ? toolbox.filesystem.delete(commandFilename) : null
      }
      let shortFilename = toolbox.app.getShortenFilename(commandFilename)
      if (!toolbox.filesystem.existsSync(commandFilename)) {
        try {
          let ret = toolbox.filesystem.writeFileSync(commandFilename, templateData)
          toolbox.print.success(`${shortFilename} Created Successfully`, 'SUCCESS')
        } catch (e) {
          toolbox.print.error(`Error creating ${shortFilename}`, 'ERROR')
        }
      } else {
        toolbox.print.error(`${shortFilename} Already Exists`, 'ERROR')
      }
    } else {
      toolbox.print.error(`${toolbox.utils.tildify(templateFilename)} template not found`, 'ERROR')
    }
    console.log('')
  },
}
