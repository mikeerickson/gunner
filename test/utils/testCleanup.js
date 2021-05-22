/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const fs = require('../../src/toolbox/filesystem')
const system = require('../../src/toolbox/system')
const { join } = require('path')

;(async () => {
  //
  // delete test commands

  // delete test extensions
  let extensionPath = join('src', 'extensions')
  await fs.delete(join(extensionPath, 'TestExtension-extension.js'))
  await fs.delete(join(extensionPath, 'sample-extension.js'))

  // delete test temp files
  let tempFiles = join('./src', 'commands', '*.temp')
  system.run(`rm -rf ${tempFiles}`)
  system.run('rm -rf .temp/')
})().catch((err) => {
  console.error(err)
})
