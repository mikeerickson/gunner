/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { system, filesystem } = require('../src/gunner')
const { expect } = require('chai')
const pkgInfo = require('../package.json')
const { dd } = require('dumper.js')

const src = filesystem.path.join(__dirname, '..')

let cli

before(() => {
  cli = async (cmd) => system.run('node ' + filesystem.path.join(src, 'bin', 'gunner') + ` ${cmd}`)
})

describe('cli: integration', async () => {
  it('should return cli version', async () => {
    const output = await cli('--version')
    expect(output).contains(pkgInfo.version)
  })
})
