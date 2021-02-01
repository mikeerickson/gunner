// const path = require('path')
const fs = require('../../src/toolbox/filesystem')
const print = require('@codedungeon/messenger')
const app = require('../../src/toolbox/app.js')
const system = require('../../src/toolbox/system.js')

;(async () => {
  await fs.delete(app.getProjectCommandPath() + '_TestCommand_.js')
  system.run(`rm -rf ${fs.path.join(app.getProjectRoot(), '.temp')}`)
  console.log('')
  print.success('Testing Complete', 'TESTING')
  console.log('')
})().catch((err) => {
  console.error(err)
})
