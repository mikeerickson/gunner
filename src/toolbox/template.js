/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const fs = require('fs')
const app = require('./app.js')
const Mustache = require('mustache')
const filesystem = require('./filesystem.js')

const template = {
  generateFile: function (template = '', target = '', data = {}, options = { overwrite: true }) {
    let templateFilename = filesystem.path.join(app.getTemplatePath(), template)
    if (fs.existsSync(templateFilename)) {
      let targetFilename = filesystem.path.join(app.getProjectRoot(), target)
      let templateData = filesystem.readFileSync(templateFilename, 'utf8')
      let renderedData = Mustache.render(templateData, data)
      if (fs.existsSync(targetFilename) && options.overwrite) {
        filesystem.delete(targetFilename)
      }
      try {
        filesystem.write(targetFilename, renderedData, options)
        return 0
      } catch (err) {
        console.log(err.message)
      }
    } else {
      return 'FILE_NOT_FOUND'
    }
  },
  readFile: function (filename) {
    if (fs.existsSync(filename)) {
      return fs.readFileSync(filename, 'utf-8')
    } else {
      return 'FILE_NOT_FOUND'
    }
  },
  writeFile: function (filename, data, options = { overwrite: true }) {
    if (fs.existsSync(filename)) {
      if (options.overwrite) {
        fs.unlinkSync(filename)
      } else {
        return 'FILE_EXISTS'
      }
    }
    fs.writeFileSync(filename, data)
    return 'SUCCESS'
  },
  render: function (templateData, data) {
    return Mustache.render(templateData, data)
  },
  process: function (filename, data) {
    if (fs.existsSync(filename)) {
      let template = fs.readFileSync(filename, 'utf8')
      return Mustache.render(template, data)
    }
    return 'TEMPLATE_NOT_FOUND'
  },
}

module.exports = template
