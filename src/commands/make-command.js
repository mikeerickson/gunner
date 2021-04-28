/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('chalk')

module.exports = {
  name: 'make:command',
  description: 'Create new command',
  usage: `make:command ${colors.blue('[Filename]')} ${colors.magenta('<flags>')}`,
  arguments: {
    name: { description: 'Command Name', required: true },
  },
  flags: {
    name: { aliases: ['n'], description: 'Command name (eg make:command)', required: true },
    description: { aliases: ['s'], description: 'Command description', required: false },
  },
  examples: ['make:command HelloWorld --name hello:world --description="Command Description"'],

  async execute(toolbox) {
    let questions = []

    if (toolbox.env.commandName.length === 0) {
      questions.push(
        toolbox.prompts.buildQuestion('input', 'commandName', 'Command Name?', {
          validate: (value, state, item, index) => {
            return value.length > 0
          },
        })
      )
    }

    if (!toolbox.arguments.description) {
      questions.push(toolbox.prompts.buildQuestion('input', 'description', 'Command Description?'))
    }

    if (questions.length > 0) {
      console.log()
      let answers = await toolbox.prompts.show(questions)
      if (answers) {
        toolbox.env.commandName = answers.commandName || toolbox.env.commandName
        toolbox.arguments.description = answers.description || toolbox.arguments.description
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
      description: toolbox.arguments.description,
    }

    console.log('')
    let templateFilename = toolbox.path.join(toolbox.app.getTemplatePath(), 'make-command.mustache')
    if (toolbox.filesystem.existsSync(templateFilename)) {
      let templateData = toolbox.template.process(templateFilename, data)
      let projectCommandPath = toolbox.path.join(toolbox.app.getProjectPath(), 'src', 'commands')

      if (!toolbox.filesystem.existsSync(projectCommandPath)) {
        toolbox.filesystem.mkdirSync(projectCommandPath, { recursive: true })
        toolbox.print.info(toolbox.colors.bold('==> Creating Project `commands` Directory'))
      }
      // check if command name has file extension, if not use ".js"
      let fileExtension = toolbox.path.extname(toolbox.env.commandName)
      fileExtension = fileExtension.length > 0 ? '' : '.js'

      let commandFilename = toolbox.path.join(projectCommandPath, toolbox.env.commandName + fileExtension)
      if (toolbox.arguments.overwrite) {
        toolbox.filesystem.existsSync(commandFilename) ? toolbox.filesystem.delete(commandFilename) : null
      }
      let shortFilename = toolbox.app.getShortenFilename(commandFilename)
      if (!toolbox.filesystem.existsSync(commandFilename)) {
        try {
          let ret = toolbox.filesystem.writeFileSync(commandFilename, templateData)
          toolbox.print.success(`${shortFilename} created successfully`, 'SUCCESS')
        } catch (e) {
          toolbox.print.error(`Error creating ${shortFilename}`, 'ERROR')
        }
      } else {
        toolbox.print.error(`${shortFilename} already exists`, 'ERROR')
      }
    } else {
      toolbox.print.error(`${toolbox.utils.tildify(templateFilename)} template not found`, 'ERROR')
    }
    console.log('')
  },
}
