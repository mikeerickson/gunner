const path = require('path')
const fs = require('fs-extra')
const { expect } = require('chai')
const { exec } = require('child_process')
const utils = require('../src/utils/cli-utils.js')

const pkgInfo = require('../package.json')

describe('make:extension', (done) => {
  let testCommandFilename = ''
  beforeEach(async () => {
    testCommandFilename = path.join(utils.getProjectCommandPath(), '_TestCommand_.js')
    if (await fs.existsSync(testCommandFilename)) {
      await fs.unlinkSync(testCommandFilename)
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
    exec(`gunner make:command ${testCommandName}`, async (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      expect(result).contain(`${testCommandName}.js created successfully`)
      await fs.unlink(testCommandFilename)
    })
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
      await fs.unlinkSync(testCommandFilename)
    }
  })
})
