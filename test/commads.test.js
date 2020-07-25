const { expect } = require('chai')
const { exec } = require('child_process')
const pkgInfo = require('../package.json')

describe('commands', (done) => {
  it('should return correct command name', (done) => {
    let sample = require('../src/commands/default')
    expect(sample.name).equal('default')
    done()
  })

  it('should show version when command help supplied', (done) => {
    exec('gunner --help', (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      expect(result).contain('v' + pkgInfo.version)
    })
    done()
  })

  it('should execute sample command help', (done) => {
    exec('gunner default --help', (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')
      expect(result).contain('default')
      expect(result).contain('default command')
      expect(result).contain('Options:')
      expect(result).contain('--message, -m')
      expect(result).contain('Command message')
    })
    done()
  })
})
