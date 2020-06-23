/* eslint-disable no-control-regex */

const strings = require('voca') // https://vocajs.com/

if (!String.prototype.hasOwnProperty('raw')) {
  Object.defineProperty(String.prototype, 'raw', {
    get: function () {
      return this.replace(/\x1b\[..?m/g, '')
    },
  })
}

module.exports = strings
