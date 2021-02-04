/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('chalk')

class Environment {
  constructor(msg = 'World') {
    this.msg = msg
  }
  sayHello(msg = null) {
    if (msg === null) {
      msg = this.msg
    }
    console.log(colors.green.bold(`Hello ${msg}`))
  }
}

module.exports = Environment
