/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('chalk')
const { dd } = require('dumper.js')
const helpers = require('../toolbox/helpers')

module.exports = {
  name: 'make:command',
  description: 'Create new command',
  usage: `make:command ${colors.blue.bold('[Filename]')} ${colors.magenta.bold('<flags>')}`,
  showPrompts: true,
  arguments: {
    name: {
      description: 'Resource Filename',
      required: true,
      prompt: {
        type: 'input',
        hint: 'as it will be saved on disk',
      },
    },
  },
  flags: {
    command: {
      aliases: ['c'],
      description: 'Command Name',
      required: true,
      prompt: {
        type: 'input',
        hint: 'e.g., make:command',
        validate: (value, state, item, index) => {
          if (!/^[a-z.,:][^,; 0-9]+$/.test(value)) {
            return colors.red.bold('Valid Characters a-z, or -_:')
          }
          return true
        },
      },
    },
    description: { aliases: ['d'], description: 'Command Description', required: false },
    hidden: { aliases: ['i'], description: 'Command Hidden', required: false },
    noArguments: { aliases: ['a'], description: 'Suppress Arguments Block', required: false },
    noComments: { aliases: ['m'], description: 'Suppress Command Comments', required: false },
    template: { aliases: ['t'], description: 'Custom Template', required: false },
  },
  examples: ['make:command HelloWorld --name hello:world --description="Command Description"'],

  async execute(toolbox) {
    let args = helpers.getArguments(toolbox.arguments, this.flags)
    let answers = this.showPrompts ? await toolbox.prompts.run(toolbox, this) : []

    // merge args and answers
    let result = { ...args, ...answers }

    if (!result.command) {
      console.log('')
      toolbox.print.warning('Command Aborted\n', 'ABORT')
      process.exit()
    }

    let commandName = toolbox.commandName || result.commandName

    let name = result.name
    let command = result.command
    let noComment = result.noComment || false
    let description = result.description
    let noArguments = result.noArguments || false

    let hidden = result.hidden || false

    let template = toolbox.arguments.template || ''

    if (!toolbox.strings.validName(commandName)) {
      console.log('')
      toolbox.print.error(`🚫  Invalid Resource Filename:  ${commandName}`)
      toolbox.print.warn('    Valid Characters A-Z, a-z, 0-9, -\n')
      process.exit(0)
    }

    if (!/^[a-z.,:][^,; 0-9]+$/.test(command)) {
      console.log('')
      toolbox.print.error(`🚫  Invalid Command:  ${command}`)
      toolbox.print.warn('    Valid Characters a-z, or -_:-\n')
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
      command,
      showArguments: !noArguments,
      description,
      template,
      hidden,
      noComment,
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

      let overwrite = toolbox.getOptionValue(toolbox.arguments, ['overwrite', 'o'])
      overwrite ? toolbox.filesystem.delete(commandFilename) : null

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
