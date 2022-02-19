/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const os = require('os')
const path = require('path')
const { expect } = require('chai')
const fs = require('../src/toolbox/filesystem')
const system = require('../src/toolbox/system')

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
    expect(fs.existsSync(trashFilename2)).to.be.false
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

  it('should return filename from path', (done) => {
    let pathName = 'src/toolbox/filesystem.js'

    expect(fs.filename(pathName)).equal('filesystem.js')

    done()
  })

  it('should return filename from path using alias', (done) => {
    let pathName = 'src/toolbox/filesystem.js'

    expect(fs.shortName(pathName)).equal('filesystem.js')

    done()
  })

  it('should return parentName from path', (done) => {
    let pathName = 'src/toolbox/filesystem.js'

    expect(fs.parentName(pathName)).equal('src/toolbox')

    done()
  })

  it('should return parentName from path using alias', (done) => {
    let pathName = 'src/toolbox/filesystem.js'

    expect(fs.dirname(pathName)).equal('src/toolbox')

    done()
  })

  it('should return directory list', (done) => {
    let dirList = fs.directoryList()

    expect(dirList.length).greaterThan(0)

    done()
  })

  it('should return directory list containing only directories', (done) => {
    let fullList = fs.directoryList()
    let dirList = fs.directoryList('', { directoriesOnly: true })

    expect(fullList.length !== dirList.length).equal(true)

    done()
  })

  it('should return directory list containing only files', (done) => {
    let fullList = fs.directoryList()
    let fileList = fs.directoryList('', { filesOnly: true })

    expect(fullList.length !== fileList.length).equal(true)

    done()
  })
})
