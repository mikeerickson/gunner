/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const sinon = require('sinon')
const { CLI } = require('../src/gunner')
const { expect } = require('chai')

let gunner

before(() => {
  gunner = new CLI()
})
describe('semver', (done) => {
  it('should have semver in toolbox', (done) => {
    let result = gunner.toolbox.hasOwnProperty('semver')
    done()
  })

  it('should pass version semver', (done) => {
    let version = gunner.toolbox.env.version
    let result = gunner.toolbox.semver.satisfies(version, '>= 0.9.0')
    done()
  })

  it('should pass minimum semver version', (done) => {
    let version = gunner.toolbox.env.version
    let result = gunner.toolbox.semver.gt(version, '0.8.0')
    expect(result).to.be.true
    done()
  })
})
