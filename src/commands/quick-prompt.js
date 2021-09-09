/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { dd } = require('dumper.js')
const { prompt, print } = require('../gunner')

module.exports = {
  name: 'quick:prompt',
  description: 'Simple Quick Prompt',
  usage: 'quick:prompt',
  arguments: {},
  flags: {},
  hidden: true,
  async execute(toolbox) {
    dd('här')
    try {
      let result = await prompt.password('Enter Password')
      if (typeof result === 'function') {
        console.log('')
        print.warn('Process Aborted', 'ABORT')
        process.exit()
      }
      console.log('')
      print.info(`Password: ${result.password}`, 'INFO')
    } catch (error) {
      print.error(`An error occurred ${error}`, 'ERROR')
    }
  },
}
