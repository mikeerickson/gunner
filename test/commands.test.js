/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { expect } = require('chai')
const { exec } = require('child_process')
const { dd } = require('dumper.js')
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
    exec('gunner say-hello --help', (err, stdout, stderr) => {
      let result = stdout.replace(/\n/gi, '')

      expect(result).contain('say-hello')
      expect(result).contain('Options:')
      expect(result).contain('--name, -n')
      expect(result).contain('Hello Name')
    })
    done()
  })
})
