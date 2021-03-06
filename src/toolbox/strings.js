/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

/* eslint-disable no-control-regex */

// https://vocajs.com/
const { dd } = require('dumper.js')
const strings = require('voca')

strings.raw = (str) => {
  return str.replace(/\x1b\[..?m/g, '')
}

strings.validName = (str) => {
  return str.match(/^[0-9a-zA-Z,-]+$/)
}

if (!String.prototype.hasOwnProperty('raw')) {
  Object.defineProperty(String.prototype, 'raw', {
    get: function () {
      return this.replace(/\x1b\[..?m/g, '')
    },
  })
}

module.exports = strings
