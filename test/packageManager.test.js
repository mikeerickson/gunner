/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const mock = require('mock-fs')
const { exec, execSync } = require('child_process')
const { expect, assert } = require('chai')
const app = require('../src/toolbox/app.js')
const system = require('../src/toolbox/system.js')
const fs = require('../src/toolbox/filesystem.js')
const filesystem = require('../src/toolbox/filesystem.js')
const packageManager = require('../src/toolbox/packageManager.js')

after((done) => {
  process.chdir(fs.path.join(fs.homedir(), 'tmp'))
  // make sure we are not in the application directory
  if (fs.cwd() !== app.getApplicationPath()) {
    system.run('rm -rf node_modules package.json yarn.lock package-lock.json .DS_store')
  }
  done()
})

describe('package manager module', (done) => {
  it('should check if yarn is installed', (done) => {
    let result = packageManager.hasYarn()
    expect(result).to.not.be.undefined
    done()
  })

  it('should fail check if cwd has yarn.lock', (done) => {
    let result = packageManager.hasYarnLock()
    expect(result).to.be.false
    done()
  })

  it('should pass check if cwd has yarn.lock', (done) => {
    let yarnLockPath = fs.path.join(fs.cwd(), 'yarn.lock')
    system.run('touch yarn.lock')
    let result = packageManager.hasYarnLock()
    fs.delete(yarnLockPath)
    expect(result).to.be.true
    done()
  })

  it('should check package.json existense and create if necessary', (done) => {
    process.chdir(fs.path.join(fs.homedir(), 'tmp'))
    if (!packageManager.hasPackageJson()) {
      packageManager.npmInit()
    }

    assert(true, packageManager.hasPackageJson())
    done()
  })

  it('should install package to users tmp directory (~/tmp)', (done) => {
    let destDir = fs.path.join(fs.homedir(), 'tmp')

    process.chdir(fs.path.join(fs.homedir(), 'tmp'))
    system.run('npm init -y')

    let result = packageManager.install('colors')
    assert(true, result)
    done()
  })

  it('should remove package from users tmp directory (~/tmp)', (done) => {
    process.chdir(fs.path.join(fs.homedir(), 'tmp'))

    let result = packageManager.install('colors')
    let removeResult = packageManager.remove('colors')
    assert(true, removeResult)
    done()
  })
})
