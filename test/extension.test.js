const sinon = require('sinon')
const { expect, assert } = require('chai')
const CLI = require('../src/gunner')
const system = require('../src/toolbox/system')

let gunner
let pkgInfo

before(() => {
  gunner = new CLI()
  pkgInfo = require('../package.json')
})

describe('extensions', (done) => {
  it('should execute hello extension', (done) => {
    let result = gunner.helloExtension()
    expect(result).contains('Hello from Gunner Extension!')
    done()
  })

  it('execute machine info extension', (done) => {
    let result = gunner.machineInfo()
    let version = system.run('defaults read loginwindow SystemVersionStampAsString')
    expect(result).equal(version)
    done()
  })
})
