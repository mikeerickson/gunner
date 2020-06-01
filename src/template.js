const fs = require('fs')
const Mustache = require('mustache')

module.exports = {
  render: (filename, data) => {
    if (fs.existsSync(filename)) {
      let template = fs.readFileSync(filename, 'utf8')
      return Mustache.render(template, data)
    }
    return 'TEMPLATE_NOT_FOUND'
  }
}
