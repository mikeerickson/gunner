#!/usr/bin/env node

const path = require('path')
const execa = require('execa')
const colors = require('chalk')
const { join } = require('path')
const { existsSync } = require('fs')
const msg = require('@codedungeon/messenger')
let validFilename = require('valid-filename')

let filename = process.argv[2] || '*.test.js'

if (!filename.includes('test')) {
  let ext = path.extname(filename) || '.js'
  filename = filename.replace(ext, '') + '.test' + ext
}

if (validFilename(filename)) {
  if (!existsSync(join('./test/', filename))) {
    msg.error(`Invalid FIlename: ./test/${filename}`, 'ERROR')
    console.log('')
    process.exit(0)
  }
}

;(async () => {
  console.log(colors.blue.bold(`==> Test Specification './test/${filename}'`))

  try {
    const subprocess = execa(
      './node_modules/mocha/bin/mocha',
      ['./test/' + filename, '--reporter', 'spec', '--timeout 5000'],
      { env: { FORCE_COLOR: 'true' } }
    )
    subprocess.stdout.pipe(process.stdout)
    const { stdout, stderr } = await subprocess
    console.log(stderr)
    if (!stderr) {
      msg.success('All Tests Passed\n', 'PASSED')
    } else {
      msg.error(stderr)
      msg.error('Testing Failed\n', 'FAIL')
    }
  } catch (error) {
    console.log('')
    msg.error('Testing Failed\n', 'FAIL')
  }

  // cleanup
  execa('node', ['./test/utils/testCleanup.js'], { stdio: 'inherit' })
})()
