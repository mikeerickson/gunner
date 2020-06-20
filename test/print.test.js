const sinon = require('sinon')
const { expect, assert } = require('chai')
const { exec } = require('child_process')
const print = require('../src/toolbox/print')

describe('print tools', (done) => {
  let printMock
  beforeEach(() => {
    printMock = sinon.mock(print)
  })

  afterEach(() => {
    printMock.verify()
  })

  it('should have success method', (done) => {
    expect(print.hasOwnProperty('success')).to.be.true

    printMock.expects('success').withArgs('success').returns('success')
    print.success('success')

    done()
  })

  it('should have error method', (done) => {
    expect(print.hasOwnProperty('error')).to.be.true

    printMock.expects('error').withArgs('error').returns('error')
    print.error('error')

    done()
  })

  it('should have warn method', (done) => {
    expect(print.hasOwnProperty('warn')).to.be.true

    printMock.expects('warn').withArgs('warn').returns('warn')
    print.warn('warn')

    done()
  })

  it('should have warning method', (done) => {
    expect(print.hasOwnProperty('warning')).to.be.true

    printMock.expects('warning').withArgs('warning').returns('warning')
    print.warning('warning')

    done()
  })

  it('should have info method', (done) => {
    expect(print.hasOwnProperty('info')).to.be.true

    printMock.expects('info').withArgs('info').returns('info')
    print.info('info')

    done()
  })

  it('should have information method', (done) => {
    expect(print.hasOwnProperty('information')).to.be.true

    printMock.expects('information').withArgs('information').returns('information')
    print.information('information')

    done()
  })

  it('should have log method', (done) => {
    expect(print.hasOwnProperty('log')).to.be.true

    printMock.expects('log').withArgs('log').returns('log')
    print.log('log')

    done()
  })

  it('should have debug method', (done) => {
    expect(print.hasOwnProperty('debug')).to.be.true

    printMock.expects('debug').withArgs('debug').returns('debug')
    print.debug('debug')

    done()
  })

  it('should have important method', (done) => {
    expect(print.hasOwnProperty('important')).to.be.true

    printMock.expects('important').withArgs('important').returns('important')
    print.important('important')

    done()
  })

  it('should have critical method', (done) => {
    expect(print.hasOwnProperty('critical')).to.be.true

    printMock.expects('critical').withArgs('critical').returns('critical')
    print.critical('critical')

    done()
  })

  it('should have status method', (done) => {
    expect(print.hasOwnProperty('status')).to.be.true

    printMock.expects('status').withArgs('status').returns('status')
    print.status('status')

    done()
  })

  it('should have notice method', (done) => {
    expect(print.hasOwnProperty('notice')).to.be.true

    printMock.expects('notice').withArgs('notice').returns('notice')
    print.notice('notice')

    done()
  })

  it('should have note method', (done) => {
    expect(print.hasOwnProperty('note')).to.be.true

    printMock.expects('note').withArgs('note').returns('note')
    print.note('note')

    done()
  })
})
