const path = require('path')
const { expect } = require('chai')
const execSync = require('sync-exec')
const { exec } = require('child_process')
const fs = require('../src/toolbox/filesystem')
const utils = require('../src/utils/cli-utils.js')

describe('make:extension', (done) => {
  let testExtensionFilename = ''
  beforeEach(async () => {
    testExtensionFilename = path.join(utils.getProjectExtensionPath(), '_TestExtension_.js')
    if (await fs.existsSync(testExtensionFilename)) {
      await fs.unlinkSync(testExtensionFilename)
    }
  })
  it('should return correct extension name', (done) => {
    let sample = require('../src/commands/make-extension.js')
    expect(sample.name).equal('make:extension')
    done()
  })

  it('should create test extension', (done) => {
    let testExtensionFilename = path.join(utils.getProjectExtensionPath(), '_TestExtension_.js')
    if (fs.existsSync(testExtensionFilename)) {
      fs.unlinkSync(testExtensionFilename)
    }

    let testExtension = '_TestExtension_'
    let result = execSync(`gunner make:extension ${testExtension} --name testExtension`)
    expect(result.stdout).contain('perform extension creation')
    // expect(result.stdout).contain(`${testExtension}.js created successfully`)
    done()
  })

  it('should show warning when extension already exists', (done) => {
    let testExtension = 'sample'
    exec(`gunner make:extension ${testExtension} --name sampleExtension`, async (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      // expect(result).contain(`${testExtension}.js already exists`)
      expect(result).contain('perform extension creation')
    })
    done()
  })

  after(async () => {
    if (await fs.existsSync(testExtensionFilename)) {
      await fs.unlinkSync(testExtensionFilename)
    }
  })
})
