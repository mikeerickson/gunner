/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const pkgInfo = require('../../package.json')

module.exports = {
  name: 'make:extension',
  description: `Create new ${pkgInfo.packageName} extension`,
  usage: 'gunner make:extension --name helloExtension',
  flags: {},
  execute(toolbox) {
    console.log('')
    let extensionName = toolbox.commandName
    toolbox.print.info(`Extension Name: ${extensionName}`)
    let projectExtensionPath = toolbox.path.join(toolbox.app.getProjectPath(), 'src', 'extensions')
    // toolbox.print.info(`macOS Version: ${toolbox.machineInfo()}`)
    // if (!toolbox.filesystem.existsSync(projectExtensionPath)) {
    //   toolbox.print.error('Invalid Gunner project. Make sure you are at project root and try again', 'ERROR')
    //   process.exit()
    // }
    let extensionFilename = toolbox.path.join(projectExtensionPath, extensionName + '.js')

    let data = 'test'

    if (!toolbox.filesystem.existsSync(projectExtensionPath)) {
      toolbox.filesystem.mkdirSync(projectExtensionPath, { recursive: true })
      toolbox.print.info(toolbox.colors.bold('==> Creating Project `extensions` Directory'))
    }

    toolbox.template.writeFile(extensionFilename, data)

    toolbox.print.log(`Extension Filename: ${extensionFilename}`)
    console.log('')
  },
}
