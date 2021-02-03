/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const app = require('../src/toolbox/app')
const { expect } = require('chai')
const filesystem = require('../src/toolbox/filesystem')
const { path } = require('../src/toolbox/filesystem')

describe('app utils', (done) => {
  it('should return application (gunner) path', (done) => {
    let appPath = app.getApplicationPath()
    expect(appPath.includes('gunner')).to.be.true
    done()
  })

  it('should return cli command path', (done) => {
    let cliCommandPath = app.getCommandPath()
    let commandPath = path.join(path.dirname(__dirname), 'src', 'commands')
    expect(cliCommandPath).equals(commandPath)
    done()
  })

  it('should return cli extension path', (done) => {
    let cliExtensionPath = app.getExtensionPath()
    let extensionPath = path.join(path.dirname(__dirname), 'src', 'extensions')
    expect(cliExtensionPath).equals(extensionPath)
    done()
  })

  it('should return cli template path', (done) => {
    let cliTemplatePath = app.getTemplatePath()
    let templatePath = path.join(path.dirname(__dirname), 'src', 'templates')
    expect(cliTemplatePath).equals(templatePath)
    done()
  })

  it('should return cli toolbox path', (done) => {
    let cliToolboxPath = app.getToolboxPath()
    let toolboxPath = path.join(path.dirname(__dirname), 'src', 'toolbox')
    expect(cliToolboxPath).equals(toolboxPath)
    done()
  })

  it('should return project path', (done) => {
    // set custom working path (pwd)
    try {
      process.chdir('/tmp')
      let projectPath = app.getProjectPath()
      expect(projectPath).equals('/private/tmp')
    } catch (err) {
      console.log('chdir: ' + err)
    }
    done()
  })

  it('should return destination path', (done) => {
    // set custom working path (pwd)
    try {
      process.chdir('/tmp')
      let destinationPath = app.getDestinationPath()
      expect(destinationPath).equals('/private/tmp')
    } catch (err) {
      console.log('chdir: ' + err)
    }
    done()
  })

  it('should return project template path', (done) => {
    // set custom working path (pwd)
    try {
      process.chdir('/tmp')
      let projectTemplatePath = app.getProjectTemplatePath()
      expect(projectTemplatePath).equals('/private/tmp/src/templates')
    } catch (err) {
      console.log('chdir: ' + err)
    }
    done()
  })

  it('should return project extensions path', (done) => {
    // set custom working path (pwd)
    try {
      process.chdir('/tmp')
      let projectExtensionPath = app.getProjectExtensionPath()
      expect(projectExtensionPath).equals('/private/tmp/src/extensions')
    } catch (err) {
      console.log('chdir: ' + err)
    }
    done()
  })

  it('should return shorten filename', (done) => {
    let testFilename = app.getShortenFilename(__filename)
    expect(testFilename).equals('./test/app.test.js')

    let commandFilename = path.join(app.getCommandPath(), 'make-command.js')
    let shortFilename = app.getShortenFilename(commandFilename)
    expect(shortFilename).equals('./src/commands/make-command.js')

    done()
  })
})
