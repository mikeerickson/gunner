/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

module.exports = {
  name: 'default',
  description: '',
  hidden: true,
  usage: 'Default Command',
  flags: {},
  execute(toolbox) {
    console.log('')
    toolbox.print.info('Default Command\n', 'INFO')
  },
}
