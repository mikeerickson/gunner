/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

/*
 - create commands directory
  - create sample command (hello-world.js)
 - initialize package.json
 - create ./index.js
 - create config file (.myapprc.json or myapp.config.js)

*/

const process = require('process')

module.exports = {
  name: 'new',
  description: 'Generate New toolbox Application',
  usage: 'new name <command> <flags>',
  flags: {
    description: { aliases: ['d'], description: 'Command description', required: false },
  },
  execute(toolbox) {
    let repo = 'https://github.com/mikeerickson/gunner.git'
    let dest = toolbox.path.join(toolbox.app.getProjectPath(), toolbox.commandName)
    if (toolbox.filesystem.existsSync(dest)) {
      console.log('')
      toolbox.print.error(`${toolbox.utils.tildify(dest)} already exists`, 'ERROR')
      process.exit(0)
    }
    // create folder
    toolbox.filesystem.mkdirSync(toolbox.commandName)

    // create package.json
    toolbox.filesystem.chdir(toolbox.commandName)
    toolbox.system.run('npm init -y')

    // create core directories
    toolbox.filesystem.mkdirSync('src')
    toolbox.filesystem.mkdirSync('src/commands')
    toolbox.filesystem.mkdirSync('src/extensions')

    // see gluegun
    console.log('')
    toolbox.print.success(`${toolbox.commandName} Project Created Successfully`, 'SUCCESS')
    toolbox.print.info('\nNext:')
    toolbox.print.info(`  > cd ${toolbox.commandName}`)
    toolbox.print.info(`  > npm link ${toolbox.commandName}`)
    toolbox.print.info(`  > ${toolbox.commandName} --help`)
  },
}
