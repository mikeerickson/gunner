const sinon = require('sinon')
const { expect, assert } = require('chai')
const CLI = require('../src/gunner')

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