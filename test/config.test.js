/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const fs = require('fs')
const sinon = require('sinon')
const { expect } = require('chai')
const pkgInfo = require('../package.json')
const config = require('../src/toolbox/config')

describe('config module', (done) => {
  it('should set value', (done) => {
    config.set('testKey', 'testValue')
    let value = config.get('testKey')
    config.delete('testKey')
    expect(value).to.equal('testValue')
    done()
  })

  it('should get value', (done) => {
    config.set('testKey', 'testValue')
    let value = config.get('testKey')
    expect(value).to.equal('testValue')
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
    expect(fs.existsSync(configFilename)).to.be.true
    done()
  })

  it('should return config data as text', (done) => {
    let configData = config.getConfigData(true)
    expect(typeof configData).to.equal('string')
    done()
  })

  it('should return config data as json', (done) => {
    config.set('appName2', 'gunner')
    let configData = config.getConfigData()
    expect(typeof configData).to.equal('object')
    expect(configData.hasOwnProperty('appName2')).to.be.true
    config.delete('appName2')
    done()
  })
})
