/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const app = require('./app.js')
const Mustache = require('mustache')
const filesystem = require('./filesystem.js')
const { error, success } = require('./print.js')()

const template = {
  generateFile: function (template = '', target = '', data = {}, options = { overwrite: true }) {
    let templateFilename = filesystem.path.join(app.getTemplatePath(), template)
    if (filesystem.exists(templateFilename)) {
      let targetFilename = filesystem.path.join(app.getProjectRoot(), target)
      let templateData = this.readFile(templateFilename, 'utf8')
      let renderedData = Mustache.render(templateData, data)
      if (filesystem.exists(targetFilename) && options.overwrite) {
        filesystem.delete(targetFilename)
      }
      try {
        this.writeFile(targetFilename, renderedData, options)
        return 0
      } catch (err) {
        error(err.message)
      }
    } else {
      return 'FILE_NOT_FOUND'
    }
  },
  mergeFile: function (template = '', target = '', data = {}, options = { overwrite: true }) {
    let templateFilename = filesystem.path.join(app.getTemplatePath(), template)
    if (filesystem.exists(templateFilename)) {
      let templateData = this.readFile(templateFilename, 'utf8')
      let renderedData = Mustache.render(templateData, data)
      if (filesystem.exists(target) && options.overwrite) {
        filesystem.delete(target)
      }
      try {
        this.writeFile(target, renderedData, options)
        return 0
      } catch (err) {
        error(err.message)
      }
    } else {
      return 'FILE_NOT_FOUND'
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
  render: function (templateData, data) {
    return Mustache.render(templateData, data)
  },
  process: function (filename, data) {
    if (filesystem.exists(filename)) {
      let template = filesystem.read(filename, 'utf8')
      return Mustache.render(template, data)
    }
    return 'TEMPLATE_NOT_FOUND'
  },
}

module.exports = template
