/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { assert, expect } = require('chai')
const app = require('../src/toolbox/app')
const CLI = require('../src/gunner')

let gunner
let toolbox

before(() => {
  let path = require('path')
  let src = path.dirname(__dirname)
  gunner = new CLI(['--quiet'], src)
  toolbox = gunner.toolbox
})

describe('cli: integration', (done) => {
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
})
