/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const path = require('path')

class App {
  constructor() {}

  getAppName() {
    let packageFilename = path.join(path.dirname(path.dirname(__dirname)), 'package.json')
    let pkgInfo = require(packageFilename)
    return pkgInfo.packageName
  }

  getAppPath() {
    return path.join(path.dirname(path.dirname(__dirname)))
  }

  getApplicationPath() {
    return path.join(path.dirname(path.dirname(__dirname)))
  }

  getShortenFilename(filename) {
    return filename.replace(this.getProjectRoot(), '.')
  }

  getProjectRoot() {
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
