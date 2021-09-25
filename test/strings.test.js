/* eslint-disable no-control-regex */
/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const sinon = require('sinon')
const semver = require('semver')
const colors = require('chalk')
const { expect } = require('chai')
const strings = require('../src/toolbox/strings')
const print = require('../src/toolbox/print')()

describe('string module', (done) => {
  it('should have version 1.4 or greater', (done) => {
    let result = semver.satisfies(strings.version, '1.x || >=1.4.0')
    expect(result).to.be.true
    done()
  })

  it('should have voca instance', (done) => {
    let result = strings.sprintf('%s %s %s', 'Michael', 'Joseph', 'Erickson')

    expect(result).to.equal('Michael Joseph Erickson')
    done()
  })

  it('should produce titleCase', (done) => {
    let result = strings.titleCase('mike erickson')
    expect(result).to.equal('Mike Erickson')
    done()
  })

  it('should produce kebab-case', (done) => {
    let result = strings.kebabCase('mike erickson')
    expect(result).to.equal('mike-erickson')
    done()
  })

  it('should produce slug', (done) => {
    let result = strings.slugify('gunner is terrific')
    expect(result).to.equal('gunner-is-terrific')
    done()
  })

  it('should produce correct raw value', (done) => {
    let result = colors.green('Michael Joseph Erickson')
    expect(result.length).equal(33)
    expect(strings.raw(result).length).equal(23)
    done()
  })

  it('should return raw string', (done) => {
    let str = strings.raw(colors.green('mike'))
    expect(str.length).equal(4)
    done()
  })

  it('should pluralize string', (done) => {
    let dogs = strings.plural('dog')
    expect(dogs).equal('dogs')

    let companies = strings.plural('company')
    expect(companies).equal('companies')

    done()
  })

  it('should singularize string', (done) => {
    let dog = strings.singular('dogs')
    expect(dog).equal('dog')

    let company = strings.singular('companies')
    expect(company).equal('company')

    done()
  })

  it('should replace all items in string', (done) => {
    let str = '<hello> <hello> <hello>'
    let result = strings.replaceAll(str, '<hello>', '<hello-world>')
    expect(result).equal('<hello-world> <hello-world> <hello-world>')
    done()
  })
})
