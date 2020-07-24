const path = require('path')
const { assert, expect } = require('chai')
const app = require('../src/toolbox/app')
const filesystem = require('../src/toolbox/filesystem')

describe('app utils', (done) => {
  it('should return application (gunner) path', (done) => {
    let appPath = app.getApplicationPath()
    assert(true, appPath.includes('gunner'))
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

  it('should return project command path', (done) => {
    try {
      process.chdir('/tmp')
      let projectCommandPath = app.getProjectCommandPath()
      expect(true).to.be.true
      expect(projectCommandPath).equals('/private/tmp/src/commands')
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
      expect(projectCommandPath).equals('/private/tmp')
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
})
