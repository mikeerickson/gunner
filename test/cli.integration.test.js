/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const CLI = require('../src/gunner')
const app = require('../src/toolbox/app')
const system = require('../src/toolbox/system')
const filesystem = require('../src/toolbox/filesystem')
const { assert, expect } = require('chai')
const pkgInfo = require('../package.json')

const src = filesystem.path.join(__dirname, '..')
const gunner2 = (cmd) => system.run('node ' + filesystem.path.join(src, 'index.js') + ` ${cmd}`)

let gunner
let toolbox

before(() => {
  let path = require('path')
  let src = path.dirname(__dirname)
  gunner = new CLI(['--quiet'], src)
  toolbox = gunner.toolbox
})

describe('cli: integration', (done) => {
  it('should return cli version', (done) => {
    const output = gunner2('--version')
    expect(output).contains(pkgInfo.version)

    done()
  })

  it('should return cli version in help', (done) => {
    const output = gunner2('--help')
    expect(output).contains(pkgInfo.version)

    done()
  })

  it('should load cli toolbox', (done) => {
    let result = toolbox.hasOwnProperty('system')
    expect(result).to.be.true
    expect(toolbox.version).to.be.string

    done()
  })

  it('should run default command', (done) => {
    let result = gunner.run({ name: 'default' })
    expect(result).contain('Default Command: Hello World')

    done()
  })

  it('should say hello', (done) => {
    const output = gunner2('sayHello')
    expect(output).contains('Hello World!')
    done()
  })
})
