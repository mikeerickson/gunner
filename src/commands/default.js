/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

module.exports = {
  name: 'default',
  description: '',
  usage: 'Do something cool, after all this is your command!',
  flags: {
    message: { aliases: ['m'], description: 'Command message' },
  },
  execute(toolbox) {
    let msg = toolbox.arguments.message || 'Hello World'
    console.log('')
    toolbox.print.info(`Default Command: ${msg}`, 'INFO')
    console.log('')
    return
  },
}
