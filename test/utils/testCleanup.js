/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const fs = require('../../src/toolbox/filesystem')
const App = require('../../src/toolbox/App.js')
const system = require('../../src/toolbox/system.js')
const path = require('path')

;(async () => {
  let app = new App({ projectRoot: '../..' })
  await fs.delete(path.join(app.getProjectCommandPath(), '_TestCommand_.js'))
  await fs.delete(path.join(app.getProjectExtensionPath(), '_TestExtension_-extension.js'))
  await fs.delete(path.join(app.getProjectExtensionPath(), 'sample-extension.js'))
  system.run(`rm -rf ${fs.path.join(app.getProjectRoot(), '.temp')}`)
})().catch((err) => {
  console.error(err)
})
