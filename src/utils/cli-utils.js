const path = require('path')

class Utils {
  constructor() {}

  getProjectPath() {
    return path.dirname(path.dirname(__dirname))
  }
  getProjectCommandPath() {
    return path.join(path.dirname(__dirname), 'commands')
  }

  getProjectTemplatePath() {
    return path.join(path.dirname(__dirname), 'templates')
  }

  getProjectExtensionPath() {
    return path.join(path.dirname(__dirname), 'extensions')
  }
}

module.exports = new Utils()
