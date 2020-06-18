const os = require('os')
const path = require('path')
const { expect } = require('chai')
const fs = require('../src/filesystem')

describe('filesystem patching', (done) => {
  it('should add .eol property', (done) => {
    let result = fs.hasOwnProperty('eol')
    expect(result).to.be.true

    expect(fs.eol).equal('\n')
    done()
  })

  it('should add .separator propery', (done) => {
    let result = fs.hasOwnProperty('separator')
    expect(result).to.be.true

    expect(fs.separator).equal('/')
    done()
  })

  it('should add .homedir method', (done) => {
    let result = fs.hasOwnProperty('homedir')
    expect(result).to.be.true

    expect(fs.homedir()).equal(os.homedir())
    done()
  })

  it('should add .cwd method', (done) => {
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
