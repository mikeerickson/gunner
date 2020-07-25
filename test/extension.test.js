/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const sinon = require('sinon')
const CLI = require('../src/gunner')
const { expect, assert } = require('chai')
const { run } = require('../src/toolbox/system')

let gunner

before(() => {
  gunner = new CLI()
})

describe('extensions', (done) => {
  let extensionMock
  beforeEach(() => {
    extensionMock = sinon.mock(gunner)
  })

  afterEach(() => {
    extensionMock.verify()
  })

  it('should execute hello extension', (done) => {
    extensionMock.expects('helloExtension').returns('Hello from Gunner Extension!')
    let result = gunner.helloExtension()

    done()
  })

  it('execute machine info extension', (done) => {
    let version = run('defaults read loginwindow SystemVersionStampAsString')
    extensionMock.expects('machineInfo').returns(version)
    let result = gunner.machineInfo()

    done()
  })
})
