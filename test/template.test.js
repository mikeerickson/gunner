/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

let { generateFile } = require('../src/toolbox/template.js')
const { expect } = require('chai')

describe('template module', (done) => {
  it('should generate file', (done) => {
    let template = 'app.test.mustache'
    let destination = '.temp/test.js'
    let result = generateFile(template, destination, { name: 'Mike' }, { overwrite: true })
    expect(result).equal(0)
    done()
  })
})
