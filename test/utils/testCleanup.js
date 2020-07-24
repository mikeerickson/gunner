// const path = require('path')
const fs = require('../../src/toolbox/filesystem')
const print = require('@codedungeon/messenger')
const app = require('../../src/toolbox/app.js')

;(async () => {
  await fs.delete(app.getProjectCommandPath() + '_TestCommand_.js')
  console.log('')
  print.success('Testing Complete', 'TESTING')
})().catch((err) => {
  console.error(err)
})
