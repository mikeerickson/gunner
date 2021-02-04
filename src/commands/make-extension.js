/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const app = require('../toolbox/app')
const pkgInfo = require('../../package.json')
const colors = require('chalk')

module.exports = {
  name: 'make:extension',
  description: `Create new ${pkgInfo.packageName} extension`,
  usage: `gunner make:extension ${colors.blue('[name]')} ${colors.magenta('<flags>')}`,
  flags: {
    function: { aliases: ['f'], description: 'Extension Function Name', required: false },
  },
  execute(toolbox) {
    console.log('')
    if (toolbox.commandName.length == 0) {
      toolbox.print.error('You must supply extension name', 'ERROR')
      console.log('')
      process.exit(0)
    }

    let projectExtensionPath = toolbox.path.join(toolbox.app.getProjectPath(), 'src', 'extensions')
    if (!toolbox.filesystem.existsSync(projectExtensionPath)) {
      toolbox.filesystem.mkdirSync(projectExtensionPath, { recursive: true })
      toolbox.print.info(toolbox.colors.bold('==> Creating Project `extensions` Directory'))
    }

    console.log('')
    let templateFilename = toolbox.path.join(toolbox.app.getTemplatePath(), 'make-extension.mustache')
    if (toolbox.filesystem.existsSync(templateFilename)) {
      let extensionFilename = toolbox.commandName
      if (!extensionFilename.includes('-extension')) {
        extensionFilename += '-extension'
      }
      let fileExtension = toolbox.path.extname(extensionFilename)
      fileExtension = fileExtension.length > 0 ? '' : '.js'
      extensionFilename += fileExtension

      // check if command name has file extension, if not use ".js"
      let templateData = toolbox.template.process(templateFilename, {
        funcName: toolbox.arguments.function || 'myFunction',
      })

      extensionFilename = toolbox.path.join(projectExtensionPath, extensionFilename)
      let shortFilename = app.getShortenFilename(extensionFilename)
      if (toolbox.arguments.overwrite) {
        toolbox.filesystem.existsSync(extensionFilename) ? toolbox.filesystem.delete(extensionFilename) : null
      }
      if (!toolbox.filesystem.existsSync(extensionFilename)) {
        try {
          let ret = toolbox.filesystem.writeFileSync(extensionFilename, templateData)
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
