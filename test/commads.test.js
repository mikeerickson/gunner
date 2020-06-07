const { expect } = require('chai')
const { exec } = require('child_process')
const pkgInfo = require('../package.json')

describe('sample', done => {
  it('should return correct command name', done => {
    let sample = require('../src/commands/sample')
    expect(sample.name).equal('sample')
    done()
  })

  it('should show version when command help supplied', done => {
    exec('gunner --help', (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      const pkgInfo = require('../package.json')
      expect(result).contain('v' + pkgInfo.version)
    })
    done()
  })

  it('should execute default command', done => {
    exec('gunner sample', (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      expect(result).equal('Sample World')
    })
    done()
  })

  it('should execute command with supplied name', done => {
    exec('gunner sample --name Mike', (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      expect(result).equal('Sample Mike')
    })
    done()
  })

  it('should execute sample command help', done => {
    exec('gunner sample --help', (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      expect(result).contain('⚙️  sample')
      expect(result).contain('Sample command, displays simple hello message')
      expect(result).contain('Options:')
      expect(result).contain('--name, -n')
      expect(result).contain('Sample name')
    })
    done()
  })
})
