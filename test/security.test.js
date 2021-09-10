/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { expect } = require('chai')
const security = require('../src/toolbox/security.lib')

// note library has specific validation codes which cannot be changed
describe('security', (done) => {
  it('fail validation using invalid password', () => {
    let result = security.validate('password')
    expect(result).to.be.false
  })

  it('pass validation using valid password', () => {
    let result = security.validate('@np#release2021!')
    expect(result).to.be.true
  })
})
