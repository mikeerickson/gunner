/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const fs = require('../../src/toolbox/filesystem')
const system = require('../../src/toolbox/system.js')
const { join } = require('path')

;(async () => {
  let extensionPath = join('src', 'extensions')
  await fs.delete(join('src', 'commands', '_TestCommand_.js'))
  await fs.delete(join(extensionPath, '_TestExtension_-extension.js'))
  await fs.delete(join(extensionPath, 'sample-extension.js'))
  let tempFiles = join('./src', 'commands', '*.temp')
  system.run(`rm -rf ${tempFiles}`)
})().catch((err) => {
  console.error(err)
})
