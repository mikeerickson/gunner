/* eslint-disable no-control-regex */
/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const sinon = require('sinon')
const semver = require('semver')
const colors = require('colors')
const { expect, assert } = require('chai')
const print = require('../src/toolbox/print')(false)
const strings = require('../src/toolbox/strings')

describe('string module', (done) => {
  it('should have version 1.4 or greater', (done) => {
    let result = semver.satisfies(strings.version, '1.x || >=1.4.0')
    expect(result).to.be.true
    done()
  })

  it('should have voca instance', (done) => {
    let result = strings.sprintf('%s %s %s', 'Michael', 'Jospeh', 'Erickson')
    assert(result, 'Michael Joseph Erickson')
    done()
  })

  it('should produce titleCase', (done) => {
    let result = strings.titleCase('mike erickson')
    assert(result, 'Mike Erickson')
    done()
  })

  it('should produce kebab-case', (done) => {
    let result = strings.kebabCase('mike erickson')
    assert(result, 'mike-erickson')
    done()
  })

  it('should produce slug', (done) => {
    let result = strings.slugify('gunner is terrific')
    assert(result, 'gunner-is-terrific')
    done()
  })

  it('should produce correct raw value', (done) => {
    let result = print.success('Michael Joseph Erickson')
    expect(result.raw.length).equal(23)
    done()
  })

  it('should return raw string', (done) => {
    let str = strings.raw(colors.green('mike'))
    expect(str.length).equal(4)
    done()
  })
})
