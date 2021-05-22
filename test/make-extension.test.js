/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const path = require('path')
const { expect } = require('chai')
const { exec, execSync } = require('child_process')
const App = require('../src/toolbox/app.js')
const fs = require('../src/toolbox/filesystem')

describe('make:extension', (done) => {
  let testExtensionFilename = ''
  beforeEach(async () => {
    app = new App({ projectRoot: path.resolve(path.dirname('../')) })

    testExtensionFilename = path.join(app.getProjectExtensionPath(), '_TestExtension_.js')
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
    let name = 'TestExtension'
    let testExtensionFilename = path.join(app.getProjectExtensionPath(), `${name}.js`)
    if (fs.existsSync(testExtensionFilename)) {
      fs.unlinkSync(testExtensionFilename)
    }

    let testExtension = name
    let result = execSync(`gunner make:extension ${testExtension} -o`)

    expect(result.toString()).contain(testExtension)
    done()
  })

  it('should show warning when extension already exists', (done) => {
    let testExtension = 'sample'
    exec(`gunner make:extension ${testExtension}`, async (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      // expect(result).contain(`${testExtension}.js already exists`)
      expect(result).contain(testExtension + '-extension.js')
    })
    done()
  })

  after(async () => {
    if (await fs.existsSync(testExtensionFilename)) {
      await fs.unlinkSync(testExtensionFilename)
    }
  })
})
