const os = require('os')
const path = require('path')
const { expect } = require('chai')
const CLI = require('../src/gunner')

let gunner
let pkgInfo

before(() => {
  gunner = new CLI()
  pkgInfo = require('../package.json')
})

describe('CLI', (done) => {
  it('appName', (done) => {
    let result = gunner.hasOwnProperty('appName')
    expect(result).to.be.true

    expect(gunner.appName).equals('gunner')
    done()
  })

  it('arguments', (done) => {
    let result = gunner.hasOwnProperty('arguments')
    expect(result).to.be.true

    done()
  })

  it('argv', (done) => {
    let result = gunner.hasOwnProperty('argv')
    expect(result).to.be.true

    done()
  })

  it('colors', (done) => {
    let result = gunner.hasOwnProperty('colors')
    expect(result).to.be.true

    done()
  })

  it('command', (done) => {
    let result = gunner.hasOwnProperty('command')
    expect(result).to.be.true

    done()
  })

  it('commandInfo', (done) => {
    let result = gunner.hasOwnProperty('commandInfo')
    expect(result).to.be.true

    done()
  })

  it('commandName', (done) => {
    let result = gunner.hasOwnProperty('commandName')
    expect(result).to.be.true

    done()
  })

  it('config', (done) => {
    let result = gunner.hasOwnProperty('config')
    expect(result).to.be.true

    done()
  })

  it('debug', (done) => {
    let result = gunner.hasOwnProperty('debug')
    expect(result).to.be.true

    done()
  })

  it('exampleInfo', (done) => {
    let result = gunner.hasOwnProperty('exampleInfo')
    expect(result).to.be.true

    done()
  })

  it('fs', (done) => {
    let result = gunner.hasOwnProperty('fs')
    expect(result).to.be.true
    done()
  })

  it('filesystem', (done) => {
    let result = gunner.hasOwnProperty('filesystem')
    expect(result).to.be.true
    done()
  })

  it('helpInfo', (done) => {
    let result = gunner.hasOwnProperty('helpInfo')
    expect(result).to.be.true
    done()
  })

  it('optionInfo', (done) => {
    let result = gunner.hasOwnProperty('optionInfo')
    expect(result).to.be.true

    // expect(gunner.optionInfo).contains('Options:')
    done()
  })

  it('overwrite', (done) => {
    let result = gunner.hasOwnProperty('overwrite')
    expect(result).to.be.true
    done()
  })

  it('packageName', (done) => {
    let result = gunner.hasOwnProperty('packageName')
    expect(result).to.be.true

    expect(gunner.packageName).equals('gunner')
    done()
  })

  it('path', (done) => {
    let result = gunner.hasOwnProperty('path')
    expect(result).to.be.true
    done()
  })

  it('pkgInfo', (done) => {
    let result = gunner.hasOwnProperty('pkgInfo')
    expect(result).to.be.true
    expect(gunner.pkgInfo).equals(pkgInfo)

    done()
  })

  it('print', (done) => {
    let result = gunner.hasOwnProperty('print')
    expect(result).to.be.true
    done()
  })

  it('projectRoot', (done) => {
    let result = gunner.hasOwnProperty('projectRoot')
    expect(result).to.be.true
    done()
  })

  it('strings', (done) => {
    let result = gunner.hasOwnProperty('strings')
    expect(result).to.be.true
    done()
  })

  it('system', (done) => {
    let result = gunner.hasOwnProperty('system')
    expect(result).to.be.true
    done()
  })

  it('tagline', (done) => {
    let result = gunner.hasOwnProperty('tagline')
    expect(result).to.be.true

    expect(gunner.tagline).equals(pkgInfo.tagline)
    done()
  })

  it('template', (done) => {
    let result = gunner.hasOwnProperty('template')
    expect(result).to.be.true
    done()
  })

  it('usageInfo', (done) => {
    let result = gunner.hasOwnProperty('usageInfo')
    expect(result).to.be.true
    done()
  })

  it('utils', (done) => {
    let result = gunner.hasOwnProperty('utils')
    expect(result).to.be.true
    done()
  })

  it('verbose', (done) => {
    let result = gunner.hasOwnProperty('verbose')
    expect(result).to.be.true
    done()
  })

  it('version', (done) => {
    let result = gunner.hasOwnProperty('version')
    expect(result).to.be.true

    expect(gunner.version).equals(pkgInfo.version)
    done()
  })
})
