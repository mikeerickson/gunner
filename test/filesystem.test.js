/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const os = require('os')
const path = require('path')
const { expect } = require('chai')
const fs = require('../src/toolbox/filesystem')
const system = require('../src/toolbox/system')
const { assert } = require('console')

describe('filesystem patching', (done) => {
  it('should validate .eol property', (done) => {
    let result = fs.hasOwnProperty('eol')
    expect(result).to.be.true

    expect(fs.eol).equal('\n')
    done()
  })

  it('should validate .separator propery', (done) => {
    let result = fs.hasOwnProperty('separator')
    expect(result).to.be.true

    expect(fs.separator).equal('/')
    done()
  })

  it('should validate .homedir method', (done) => {
    let result = fs.hasOwnProperty('homedir')
    expect(result).to.be.true

    expect(fs.homedir()).equal(os.homedir())
    done()
  })

  it('should validate .trash method', (done) => {
    let result = fs.hasOwnProperty('trash')
    expect(result).to.be.true

    // create test file, will be trashed below
    let testFilename = fs.path.join(fs.homedir(), 'tmp', 'test-file.txt')
    fs.writeFileSync(testFilename, 'test')

    fs.trash(testFilename)

    let trashFilename2 = fs.path.join(fs.homedir(), '.Trash', 'dog.txt')
    assert(true, fs.existsSync(trashFilename2))

    done()
  })

  it('should validate .cwd method', (done) => {
    let result = fs.hasOwnProperty('cwd')
    expect(result).to.be.true

    expect(fs.cwd()).equal(process.cwd())

    expect(fs.cwd('..')).equal(path.dirname(process.cwd()))
    done()
  })

  it('should use cwd override method', (done) => {
    let result = fs.hasOwnProperty('cwd')
    expect(fs.cwd()).equal(process.cwd())

    expect(fs.cwd('..')).equal(path.dirname(process.cwd()))
    done()
  })
})
