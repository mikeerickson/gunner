/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

'use strict'

const { Input } = require('enquirer')
const colors = require('ansi-colors')
const prompt = new Input({
  message: 'What is your username?',
  initial: 'jonschlinkert',
  styles: {
    primary: colors.blue,
    get submitted() {
      return this.complement
    },
  },
})

prompt
  .run()
  .then((name) => console.log('Name:', name))
  .catch(console.log)
