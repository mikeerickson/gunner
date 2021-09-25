/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

/* eslint-disable no-control-regex */

// https://vocajs.com/
const pluarlize = require('pluralize')
const strings = require('voca')
const ansiRegex = require('ansi-regex')

const escapeRegExp = (string) => {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

strings.raw = (str) => {
  return str.replace(ansiRegex(), '')
}

strings.plural = (str) => {
  return pluarlize(str)
}

strings.singular = (str) => {
  return pluarlize.singular(str)
}

strings.replaceAll = (str, find, replace) => {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace)
}

strings.validName = (str) => {
  if (!str) return false
  return str.match(/^[0-9a-zA-Z,-]+$/)
}

if (!String.prototype.hasOwnProperty('raw')) {
  Object.defineProperty(String.prototype, 'raw', {
    get: function () {
      return this.replace(ansiRegex(), '')
      // return this.replace(/\x1b\[..?m/g, '')
    },
  })
}

module.exports = strings
