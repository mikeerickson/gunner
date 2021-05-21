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
  arguments: {
    name: { description: 'Saved Filename', required: true, help: 'You must supply Name (as it will be saved on disk)' },
  },
  flags: {
    name: { aliases: ['n'], descriptio: 'Command Name (eg make:command)', required: true },
    description: { aliases: ['s'], description: 'Command Description', required: false },
    hidden: { aliases: ['i'], description: 'Command Hidden', required: false },
    arguments: { aliases: ['a'], description: 'Include Arguments Block', required: false },
    template: { aliases: ['t'], description: 'Custom Template', required: false },
    quiet: { aliases: ['q'], description: 'Suppress Command Documentation', required: false },
  },
  examples: ['make:command HelloWorld --name hello:world --description="Command Description"'],

  async execute(toolbox) {
    let questions = []
    let quiet = toolbox.getOptionValue(toolbox.arguments, ['quiet', 'q'])

    if (toolbox.commandName.length === 0) {
      questions.push(
        toolbox.prompts.buildQuestion('input', 'commandName', 'Command Filename', {
          validate: (value, state, item, index) => {
            return value.length > 0
          },
        })
      )
    }

    // if (!toolbox.arguments.description) {
    //   questions.push(toolbox.prompts.buildQuestion('input', 'description', 'Command Description'))
    // }

    // if (!toolbox.arguments.arguments) {
    //   questions.push(toolbox.prompts.buildQuestion('confirm', 'showArguments', 'Include Arguments Block?'))
    // }

    if (questions.length > 0) {
      console.log()
      let answers = await toolbox.prompts.show(questions)

      if (answers) {
        toolbox.commandName = answers.commandName || toolbox.commandName
        toolbox.arguments.description = answers.description || toolbox.arguments.description
        toolbox.arguments.showArguments = answers.showArguments || toolbox.arguments.arguments || false
        toolbox.arguments.hidden = toolbox.arguments.hidden || false
      } else {
        console.log('')
        toolbox.print.warn('Command Creation Cancelled', 'WARNING')
        console.log('')
        process.exit(0)
      }
    }

    if (!toolbox.strings.validName(toolbox.commandName)) {
      console.log('')
      toolbox.print.error(`🚫  Invalid Name:  ${toolbox.commandName}`)
      toolbox.print.warn('    Valid Characters A-Z, a-z, 0-9, -\n')
      process.exit(0)
    }

    if (toolbox.arguments.name === null) {
      let cmdName = toolbox.strings.kebabCase(toolbox.commandName)
      toolbox.arguments.name = cmdName
    }

    let data = {
      name: toolbox.arguments.name,
      showArguments: toolbox.arguments.arguments || false,
      description: toolbox.arguments.description,
      template: toolbox.arguments.template || '',
      hidden: toolbox.arguments.hidden || false,
      quiet: !quiet,
    }

    console.log('')
    console.log('')

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
