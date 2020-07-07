/* eslint-disable no-control-regex */

const strings = require('voca') // https://vocajs.com/

strings.raw = (str) => {
  console.log('str', str)
  return str.replace(/\x1b\[..?m/g, '')
}

if (!String.prototype.hasOwnProperty('raw')) {
  Object.defineProperty(String.prototype, 'raw', {
    get: function () {
      return this.replace(/\x1b\[..?m/g, '')
    },
  })
}

module.exports = strings