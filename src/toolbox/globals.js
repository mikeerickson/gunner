/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { dd, dump } = require('dumper.js')

const globals = {
  init: () => {
    global.dd = (data) => {
      console.log('')
      dd(data)
    }

    global.dump = (data) => {
      console.log('')
      dump(data)
    }
  },
}

module.exports = globals
