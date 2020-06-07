'use strict'

const colors = require('ansi-colors')
const { prompt } = require('enquirer')

module.exports = {
  confirm: message => {
    prompt({
      type: 'confirm',
      name: 'kids',
      message: message,
      styles: { primary: colors.blue },
      initial: true,
      separator: () => '',
      format: () => ''
    })
      .then(answer => console.log('Answer:', answer))
      .catch(console.error)
  }
}
