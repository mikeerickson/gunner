/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const fs = require('fs')
const sinon = require('sinon')
const { expect, assert } = require('chai')
const pkgInfo = require('../package.json')
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
    let configFilename = config.configFilename()
    expect(configFilename).contains(pkgInfo.packageName + '.json')
    assert(fs.existsSync(configFilename), true)
    done()
  })

  it('should return config data as text', (done) => {
    let configData = config.getConfigData(true)
    assert(typeof configData, 'string')
    done()
  })

  it('should return config data as json', (done) => {
    config.set('appName2', 'gunner')
    let configData = config.getConfigData()
    assert(typeof configData, 'object')
    assert(configData.hasOwnProperty('appName2'))
    config.delete('appName2')
    done()
  })
})
