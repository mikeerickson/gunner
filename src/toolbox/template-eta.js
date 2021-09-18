'use strict'

/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const eta = require('eta')
const { dd } = require('dumper.js')
const filesystem = require('./filesystem.js')
const { error, success } = require('./print.js')

module.exports = {
  renderConfig: () => {
    return {
      varName: 'np',
      parse: {
        exec: '*',
        interpolate: '',
        raw: '',
      },
      autoTrim: false,
      globalAwait: true,
      useWith: true,
    }
  },

  readFile: function (filename) {
    if (filesystem.exists(filename)) {
      return filesystem.read(filename, 'utf-8')
    } else {
      return 'FILE_NOT_FOUND'
    }
  },

  writeFile: function (filename, data, options = { overwrite: true }) {
    if (filesystem.exists(filename)) {
      if (options.overwrite) {
        filesystem.delete(filename)
      } else {
        return 'FILE_EXISTS'
      }
    }
    filesystem.write(filename, data)
    return 'SUCCESS'
  },

  render: function (templateData = '', data = {}, options = { short: false }) {
    let renderOptions = this.renderConfig()

    if (options.extended) {
      delete renderOptions.parse
    }

    // const renderedData = eta.render(templateData, data, renderOptions)
    // dd(renderedData)

    try {
      const renderedData = eta.render(templateData, data, renderOptions)

      return renderedData
    } catch (err) {
      return { status: 'fail', message: err.message }
    }
  },

  renderTemplate: function (templateFilename = '', data = {}) {
    if (filesystem.exists(templateFilename)) {
      try {
        const templateData = this.readFile(templateFilename, 'utf8')

        const renderedData = eta.render(templateData, data, this.renderConfig())

        return renderedData
      } catch (err) {
        return { status: 'fail', message: err.message }
      }
    } else {
      dd(templateFilename)
      return `FILE_NOT_FOUND: ${templateFilename}`
    }
  },

  generateFile: function (templateFilename = '', targetFilename = '', data = {}, options = { overwrite: true }) {
    if (filesystem.exists(templateFilename)) {
      try {
        // const templateData = this.readFile(templateFilename, 'utf8')
        // dd(templateData)
        const renderedData = this.renderTemplate(templateFilename, data, this.renderConfig())

        if (!renderedData.hasOwnProperty('status')) {
          if (filesystem.exists(targetFilename) && options.overwrite) {
            filesystem.delete(targetFilename)
          }

          this.writeFile(targetFilename, renderedData, options)
          return false
        } else {
          return renderedData
        }
      } catch (err) {
        console.error(err.message)
      }
    } else {
      return `FILE_NOT_FOUND: ${templateFilename}`
    }
  },
}
