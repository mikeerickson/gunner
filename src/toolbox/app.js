const path = require('path')

class App {
  constructor() {}

  getApplicationPath() {
    return path.join(path.dirname(path.dirname(__dirname)))
  }

  getCommandPath() {
    return path.join(path.dirname(path.dirname(__dirname)), 'src', 'commands')
  }

  getExtensionPath() {
    return path.join(path.dirname(path.dirname(__dirname)), 'src', 'extensions')
  }

  getTemplatePath() {
    return path.join(path.dirname(path.dirname(__dirname)), 'src', 'templates')
  }

  getToolboxPath() {
    return path.join(path.dirname(path.dirname(__dirname)), 'src', 'toolbox')
  }

  getProjectPath() {
    return process.cwd()
  }

  getDestinationPath() {
    return process.cwd()
  }

  getProjectCommandPath() {
    return path.join(this.getProjectPath(), 'src', 'commands')
  }

  getProjectTemplatePath() {
    return path.join(this.getProjectPath(), 'src', 'templates')
  }

  getProjectExtensionPath() {
    return path.join(this.getProjectPath(), 'src', 'extensions')
  }
}

module.exports = new App()
