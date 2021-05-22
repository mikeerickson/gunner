/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const path = require('path')
const { expect } = require('chai')
const { exec, execSync } = require('child_process')
const App = require('../src/toolbox/App.js')
const fs = require('../src/toolbox/filesystem')
const execa = require('execa')
const { dd } = require('dumper.js')

describe('make:command', (done) => {
  let testCommandFilename = ''
  let app
  beforeEach(async () => {
    app = new App({ projectRoot: path.resolve(path.dirname('../')) })
    testCommandFilename = path.join(app.getProjectCommandPath(), 'TestCommand.js')
    if (await fs.existsSync(testCommandFilename)) {
      await fs.delete(testCommandFilename)
    }
  })
  it('should return correct command name', (done) => {
    let sample = require('../src/commands/make-command.js')
    expect(sample.name).equal('make:command')
    done()
  })

  it('should show version when command help supplied', (done) => {
    exec('gunner make:command --help', (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      expect(result).contain('🛠  make:command')
    })
    done()
  })

  it('should create test command', (done) => {
    let testCommandName = 'TestCommand'
    let testCommandFilename = path.join(app.getProjectCommandPath(), `${testCommandName}.js`)
    let cmd = `gunner make:command ${testCommandName} --name test --description test --overwrite`

    let result = execSync(cmd)
    result = result.toString()

    let msg = result.replace(/\n/gi, '')
    expect(msg).contain(`${testCommandName}.js Created Successfully`)
    // fs.delete(testCommandFilename)
    done()
  })

  it('should show warning when command already exists', (done) => {
    let testCommandName = 'make-command'
    exec(`gunner make:command ${testCommandName} --name test --description test`, async (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      expect(result).contain(`${testCommandName}.js Already Exists`)
    })
    done()
  })

  it('should prompt for description', async (done) => {
    let testCommandName = '_InvalidName_'
    exec(
      `gunner make:command ${testCommandName} --name test --description test --overwrite`,
      async (err, stdout, stderr) => {
        let result = stdout.replace(/\n/gi, '')
        expect(result).contain(`Invalid Name:  ${testCommandName}`)
      }
    )
    done()
  })

  it('should handle --arguments flag', (done) => {
    let testCommandName = 'TestCommandFlag'
    exec(
      `gunner make:command ${testCommandName} --name test --arguments --overwrite --description test`,
      (err, stdout, stderr) => {
        let result = stdout.replace(/\n/gi, '')

        let testCommandFilename = path.join(app.getProjectCommandPath(), `${testCommandName}.js`)
        let data = fs.readFileSync(testCommandFilename, 'utf-8')
        fs.delete(testCommandFilename)
        expect(data).to.contain('arguments: {')
      }
    )
    done()
  })

  it('should suppress doc blocks using quiet flag', (done) => {
    let testCommandName = 'TestCommandDocBlocks'
    exec(
      `gunner make:command ${testCommandName} --name test --arguments --overwrite --description test --quiet`,
      (err, stdout, stderr) => {
        let result = stdout.replace(/\n/gi, '')

        let testCommandFilename = path.join(app.getProjectCommandPath(), `${testCommandName}.js`)
        let data = fs.readFileSync(testCommandFilename, 'utf-8')

        expect(data).to.not.contain('Command Descritption')
        expect(data).to.not.contain('- you can use the following variables when creating your command')

        fs.delete(testCommandFilename)
      }
    )
    done()
  })

  it('should set hidden to true using hidden flag', (done) => {
    let testCommandName = 'HiddenCommand'
    exec(
      `gunner make:command ${testCommandName} --name test --overwrite --description test --hidden`,
      (err, stdout, stderr) => {
        let result = stdout.replace(/\n/gi, '')

        let testCommandFilename = path.join(app.getProjectCommandPath(), `${testCommandName}.js`)

        let data = fs.readFileSync(testCommandFilename, 'utf-8')

        fs.delete(testCommandFilename)

        expect(data).to.contain('hidden: true,')
      }
    )
    done()
  })

  it('should create command using custom template', (done) => {
    let testCommandName = 'CustomTemplateCommand'
    exec(
      `gunner make:command ${testCommandName} --name test --overwrite --description test --template="test/custom-templates/make-command.mustache"`,
      (err, stdout, stderr) => {
        let result = stdout.replace(/\n/gi, '')

        let testCommandFilename = path.join(app.getProjectCommandPath(), `${testCommandName}.js`)

        let data = fs.readFileSync(testCommandFilename, 'utf-8')

        fs.delete(testCommandFilename)

        expect(data).to.contain('// Custom Template')
      }
    )
    done()
  })

  after(async () => {
    if (await fs.existsSync(testCommandFilename)) {
      await fs.delete(testCommandFilename)
    }
  })
})
