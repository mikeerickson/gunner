// const path = require('path')
const fs = require('../../src/toolbox/filesystem')
const print = require('@codedungeon/messenger')
const utils = require('../../src/utils/cli-utils.js')

;(async () => {
  await fs.delete(utils.getProjectCommandPath() + '_TestCommand_.js')
  console.log('')
  print.success('Testing Complete', 'TESTING')
})().catch((err) => {
  console.error(err)
})
