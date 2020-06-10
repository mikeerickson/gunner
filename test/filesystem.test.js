const { expect } = require('chai')
const CLI = require('../src/gunner.js')
const os = require('os')
const path = require('path')

describe('filesystem patching', done => {
  it('should add .eol property', done => {
    const gunner = new CLI()
    let result = gunner.fs.hasOwnProperty('eol')
    expect(result).to.be.true

    expect(gunner.fs.eol).equal('\n')
    done()
  })

  it('should add .separator propery', done => {
    const gunner = new CLI()
    let result = gunner.fs.hasOwnProperty('separator')
    expect(result).to.be.true

    expect(gunner.fs.separator).equal('/')
    done()
  })

  it('should add .homedir method', done => {
    const gunner = new CLI()
    let result = gunner.fs.hasOwnProperty('homedir')
    expect(result).to.be.true

    expect(gunner.fs.homedir()).equal(os.homedir())
    done()
  })

  it('should add .cwd method', done => {
    const gunner = new CLI()
    let result = gunner.fs.hasOwnProperty('cwd')
    expect(result).to.be.true

    expect(gunner.fs.cwd()).equal(process.cwd())

    expect(gunner.fs.cwd('..')).equal(path.dirname(process.cwd()))
    done()
  })

  it('should use cwd override method', done => {
    const gunner = new CLI()
    let result = gunner.fs.hasOwnProperty('cwd')

    expect(gunner.fs.cwd()).equal(process.cwd())

    expect(gunner.fs.cwd('..')).equal(path.dirname(process.cwd()))
    done()
  })
})
