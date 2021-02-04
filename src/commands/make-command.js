/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const app = require('../toolbox/app')
const { debug } = require('../toolbox/print')
const pkgInfo = require('../../package.json')
const colors = require('chalk')

module.exports = {
  name: 'make:command',
  description: `Create a new ${pkgInfo.packageName} command`,
  usage: `make:command ${colors.blue('[CommandName]')} ${colors.magenta('<flags>')}`,
  flags: {
    name: { aliases: ['n'], description: 'Command name (eg make:command)', required: false },
    description: { aliases: ['d'], description: 'Command description', required: false },
  },
  execute(toolbox) {
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
      let shortFilename = app.getShortenFilename(commandFilename)

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
