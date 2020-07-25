/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const path = require('path')
const { expect } = require('chai')
const execSync = require('sync-exec')
const { exec } = require('child_process')
const app = require('../src/toolbox/app.js')
const fs = require('../src/toolbox/filesystem')

describe('make:command', (done) => {
  let testCommandFilename = ''
  beforeEach(async () => {
    testCommandFilename = path.join(app.getProjectCommandPath(), '_TestCommand_.js')
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
    let testCommandName = '_TestCommand_'
    let testCommandFilename = path.join(app.getProjectCommandPath(), `${testCommandName}.js`)

    let result = execSync(`gunner make:command ${testCommandName} --overwrite`)
    let msg = result.stdout.replace(/\n/gi, '')
    expect(msg).contain(`${testCommandName}.js created successfully`)
    // fs.delete(testCommandFilename)
    done()
  })

  it('should show warning when command already exists', (done) => {
    let testCommandName = 'sample'
    exec(`gunner make:command ${testCommandName}`, async (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      expect(result).contain(`${testCommandName}.js already exists`)
    })
    done()
  })

  after(async () => {
    if (await fs.existsSync(testCommandFilename)) {
      await fs.delete(testCommandFilename)
    }
  })
})
