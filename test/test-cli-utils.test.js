const path = require('path')
const { expect } = require('chai')
const utils = require('../src/utils/cli-utils')
const filesystem = require('../src/toolbox/filesystem')

describe('cli-utils', (done) => {
  it('should return cli command path', (done) => {
    let cliCommandPath = utils.getCommandPath()
    let commandPath = path.join(path.dirname(__dirname), 'src', 'commands')
    expect(cliCommandPath).equals(commandPath)
    done()
  })

  it('should return cli extension path', (done) => {
    let cliExtensionPath = utils.getExtensionPath()
    let extensionPath = path.join(path.dirname(__dirname), 'src', 'extensions')
    expect(cliExtensionPath).equals(extensionPath)
    done()
  })

  it('should return cli template path', (done) => {
    let cliTemplatePath = utils.getTemplatePath()
    let templatePath = path.join(path.dirname(__dirname), 'src', 'templates')
    expect(cliTemplatePath).equals(templatePath)
    done()
  })

  it('should return cli toolbox path', (done) => {
    let cliToolboxPath = utils.getToolboxPath()
    let toolboxPath = path.join(path.dirname(__dirname), 'src', 'toolbox')
    expect(cliToolboxPath).equals(toolboxPath)
    done()
  })

  it('should return project path', (done) => {
    // set custom working path (pwd)
    try {
      process.chdir('/tmp')
      let projectPath = utils.getProjectPath()

      expect(projectPath).equals('/private/tmp')
    } catch (err) {
      console.log('chdir: ' + err)
    }
    done()
  })

  it('should return project command path', (done) => {
    // set custom working path (pwd)
    try {
      process.chdir('/tmp')
      let projectCommandPath = utils.getProjectCommandPath()
      expect(projectCommandPath).equals('/private/tmp/src/commands')
    } catch (err) {
      console.log('chdir: ' + err)
    }
    done()
  })

  it('should return project template path', (done) => {
    // set custom working path (pwd)
    try {
      process.chdir('/tmp')
      let projectTemplatePath = utils.getProjectTemplatePath()
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
      let projectExtensionPath = utils.getProjectExtensionPath()
      expect(projectExtensionPath).equals('/private/tmp/src/extensions')
    } catch (err) {
      console.log('chdir: ' + err)
    }
    done()
  })
})
