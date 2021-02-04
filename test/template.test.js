/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

let template = require('../src/toolbox/template.js')
const { expect } = require('chai')

describe('template module', (done) => {
  it('should generate file', (done) => {
    let templateFilename = 'app.test.mustache'
    let destinationFilename = '.temp/test.js'
    let result = template.generateFile(templateFilename, destinationFilename, { name: 'Mike' }, { overwrite: true })
    expect(result).equal(0)
    done()
  })
})
