/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

module.exports = {
  name: 'say-hello',
  description: 'Say hello to my little friend!',
  usage: 'Do something cool, after all this is your command!',
  flags: {
    name: { aliases: ['n'], description: 'Command name' },
  },
  execute(toolbox) {
    let name = toolbox.strings.titleCase(toolbox.arguments.name || 'world')
    console.log()
    toolbox.print.success(`Hello ${name}!`, 'SUCCESS')
  },
}
