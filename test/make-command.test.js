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
    let result = execSync(`gunner make:command ${testCommandName} --name test --description test --overwrite`)
    result = result.toString()

    let msg = result.replace(/\n/gi, '')
    expect(msg).contain(`${testCommandName}.js created successfully`)
    // fs.delete(testCommandFilename)
    done()
  })

  it('should show warning when command already exists', (done) => {
    let testCommandName = 'make-command'
    exec(`gunner make:command ${testCommandName} --name test --description test`, async (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      expect(result).contain(`${testCommandName}.js already exists`)
    })
    done()
  })

  it('should prompt for description`', async (done) => {
    let testCommandName = '_InvalidName_'
    exec(`gunner make:command ${testCommandName} --name test --description test`, async (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      expect(result).contain(`Invalid Name:  ${testCommandName}`)
    })
    done()
  })

  after(async () => {
    if (await fs.existsSync(testCommandFilename)) {
      await fs.delete(testCommandFilename)
    }
  })
})
