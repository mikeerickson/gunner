/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { dd } = require('dumper.js')
const { existsSync } = require('fs')
const path = require('path')
const filesystem = require('./filesystem')

class App {
  constructor(args) {
    this.projectRoot = args.projectRoot
  }

  getAppName() {
    let packageFilename = path.join(path.dirname(path.dirname(this.projectRoot)), 'package.json')
    let pkgInfo = require(packageFilename)
    return pkgInfo.packageName
  }

  getAppPath() {
    return path.resolve(path.dirname(this.projectRoot))
  }

  getApplicationPath() {
    return path.resolve(path.dirname(this.projectRoot))
  }

  getShortenFilename(filename) {
    return filename.replace(process.cwd(), '.')
  }

  getProjectRoot() {
    // return this.projectRoot
    return this.projectRoot
  }

  getCommandPath() {
    return path.join(path.resolve(this.projectRoot), 'src', 'commands')
  }

  getCommandList() {
    let commands = []
    let commandFiles = filesystem.directoryList(this.getCommandPath(), { filesOnly: true })
    commandFiles.forEach((file) => {
      try {
        let module = require(file)
        if (module?.name) {
          commands.push(module.name)
        }
      } catch (error) {
        throw new Error(`Invalid Command: ${file}`)
      }
    })

    return commands
  }

  getExtensionPath() {
    return path.join(path.resolve(this.projectRoot), 'src', 'extensions')
  }

  getTemplatePath() {
    return path.join(path.resolve(this.projectRoot), 'src', 'templates')
  }

  getToolboxPath() {
    return path.join(path.resolve(this.projectRoot), 'src', 'toolbox')
  }

  getProjectPath() {
    return process.cwd()
  }

  getDestinationPath() {
    return process.cwd()
  }

  getProjectCommandPath() {
    return path.join(process.cwd(), 'src', 'commands')
  }

  getProjectTemplatePath() {
    return path.join(this.getProjectPath(), 'src', 'templates')
  }

  getProjectExtensionPath() {
    return path.join(this.getProjectPath(), 'src', 'extensions')
  }
}

module.exports = App
