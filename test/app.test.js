/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const App = require('../src/toolbox/app')
const { expect } = require('chai')
const filesystem = require('../src/toolbox/filesystem')
const { path } = require('../src/toolbox/filesystem')

describe('app utils', (done) => {
  let app
  beforeEach(() => {
    app = new App({ projectRoot: path.resolve(path.dirname('../')) })
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
      let cwd = process.cwd()
      process.chdir('/tmp')
      let projectPath = app.getProjectPath()
      expect(projectPath).equals('/private/tmp')
      process.chdir(cwd)
    } catch (err) {
      console.log('chdir: ' + err)
    }
    done()
  })

  it('should return destination path', (done) => {
    // set custom working path (pwd)
    try {
      let cwd = process.cwd()
      process.chdir('/tmp')
      let destinationPath = app.getDestinationPath()
      expect(destinationPath).equals('/private/tmp')
      process.chdir(cwd)
    } catch (err) {
      console.log('chdir: ' + err)
    }
    done()
  })

  it('should return project template path', (done) => {
    // set custom working path (pwd)
    try {
      let cwd = process.cwd()
      process.chdir('/tmp')
      let projectTemplatePath = app.getProjectTemplatePath()
      expect(projectTemplatePath).equals('/private/tmp/src/templates')
      process.chdir(cwd)
    } catch (err) {
      console.log('chdir: ' + err)
    }
    done()
  })

  it('should return project extensions path', (done) => {
    // set custom working path (pwd)
    try {
      let cwd = process.cwd()
      process.chdir('/tmp')
      let projectExtensionPath = app.getProjectExtensionPath()
      expect(projectExtensionPath).equals('/private/tmp/src/extensions')
      process.chdir(cwd)
    } catch (err) {
      console.log('chdir: ' + err)
    }
    done()
  })

  it('should return shorten filename', (done) => {
    let appInstance = new App({ projectRoot: path.dirname(__dirname) })
    let testFilename = appInstance.getShortenFilename(__filename)
    expect(testFilename).equals('./test/app.test.js')

    // let commandFilename = path.join(app.getCommandPath(), 'make-command.js')
    // let shortFilename = app.getShortenFilename(commandFilename)
    // expect(shortFilename).equals('./src/commands/make-command.js')

    done()
  })
})
