/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { api } = require('../src/gunner')
const { expect } = require('chai')

describe('api module', (done) => {
  let apiTest
  beforeEach(() => {
    apiTest = api.create({
      baseURL: 'https://jsonplaceholder.typicode.com',
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
  })

  it('should make simple api call (get)', async () => {
    let response = await apiTest.get('/posts')
    expect(response.status).to.equal(200)
    expect(response.data).to.be.an('array')
    expect(response.data.length).to.be.greaterThan(0)
    expect(response.data[0]).to.have.property('userId')
    expect(response.data[0]).to.have.property('title')
    expect(response.data[0]).to.have.property('body')
  })

  it('should make simple api call (get individual)', async () => {
    let response = await apiTest.get('/posts/1')
    expect(response.status).to.equal(200)
    expect(response.data).to.have.property('userId')
    expect(response.data).to.have.property('title')
    expect(response.data).to.have.property('body')
  })
})
