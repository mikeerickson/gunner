/* eslint-disable no-control-regex */
const sinon = require('sinon')
const semver = require('semver')
const { expect, assert } = require('chai')
const print = require('../src/toolbox/print')
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
})
