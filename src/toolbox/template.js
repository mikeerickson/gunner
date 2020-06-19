const fs = require('fs')
const Mustache = require('mustache')

module.exports = {
  readFile: (filename) => {
    if (fs.existsSync(filename)) {
      return fs.readFileSync(filename, 'utf-8')
    } else {
      return 'FILE_NOT_FOUND'
    }
  },
  writeFile: (filename, data, options = { overwrite: true }) => {
    if (fs.existsSync(filename)) {
      if (options.overwrite) {
        fs.unlinkSync(filename)
      } else {
        return 'FILE_EXISTS'
      }
    }
    fs.writeFileSync(filename, data)
  },
  render: (templateData, data) => {
    return Mustache.render(templateData, data)
  },
  process: (filename, data) => {
    if (fs.existsSync(filename)) {
      let template = fs.readFileSync(filename, 'utf8')
      return Mustache.render(template, data)
    }
    return 'TEMPLATE_NOT_FOUND'
  },
}
