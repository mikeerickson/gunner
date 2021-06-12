/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { system, filesystem } = require('../src/gunner')
const { expect } = require('chai')
const pkgInfo = require('../package.json')

let cli
before(() => {
  cli = async (cmd = '', options = []) => system.exec(cmd, options, { quiet: true })
})

describe('hooks: integration', async () => {
  it('should return cli version', async () => {
    const output = await cli('gunner', ['--version', '--quiet'])

    expect(output).contains(pkgInfo.version)
  })
})
