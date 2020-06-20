const fs = require('fs')
const sinon = require('sinon')
const { expect, assert } = require('chai')
const config = require('../src/toolbox/config')

describe('config module', (done) => {
  it('should set value', (done) => {
    config.set('testKey', 'testValue')
    let value = config.get('testKey')
    config.delete('testKey')
    assert(value, 'testValue')
    done()
  })

  it('should get value', (done) => {
    config.set('testKey', 'testValue')
    let value = config.get('testKey')
    assert(value, 'testValue')
    config.delete('testKey')
    done()
  })

  it('should delete key', (done) => {
    config.set('testKey', 'testValue')
    config.delete('testKey')
    let result = config.hasKey('deleteKey')
    expect(result).to.be.false
    done()
  })

  it('should verify hasKey', (done) => {
    config.set('testKey', 'testValue')
    let result = config.hasKey('testKey')
    expect(result).to.be.true
    config.delete('testKey')
    done()
  })

  it('should return config filename', (done) => {
    const pkgInfo = require('../package.json')
    let configFilename = config.configFilename()
    expect(configFilename).contains(pkgInfo.packageName + '.json')
    assert(fs.existsSync(configFilename), true)
    done()
  })

  it('should return config data as text', (done) => {
    config.set('appName', 'gunner')
    let configData = JSON.parse(config.getConfigData())
    assert(configData.appName, 'gunner')
    config.delete('appName')
    done()
  })

  it('should return config data as json', (done) => {
    config.set('appName', 'gunner')
    let configData = config.getConfigData(true)
    assert(configData.appName, 'gunner')
    config.delete('appName')
    done()
  })
})
