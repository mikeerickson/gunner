/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const path = require('path')
const { expect } = require('chai')
let template = require('../src/toolbox/template-eta.js')
const { filesystem, strings } = require('../src/gunner')
const { dd } = require('dumper.js')

describe('template module (eta)', (done) => {
  describe('template module (eta): render', (done) => {
    it('should render data using variable', (done) => {
      let templateFilename = path.join(__dirname, '..', 'test', 'templates', 'app.test.eta')

      let templateData = template.readFile(templateFilename)

      let result = template.render(templateData, { name: 'Mike' }, { overwrite: true })

      expect(result).to.not.be.false

      expect(result).contain(`console.log('Hello Mike')`) // eslint-disable-line

      done()
    })

    it('should render data using inline function', (done) => {
      let templateFilename = path.join(__dirname, '..', 'test', 'templates', 'app.test-function.eta')

      let templateData = template.readFile(templateFilename)

      const data = {
        name: 'Mike Erickson',
        helloWorld: function (param = '') {
          return param
        },
        names: ['mike', 'kira', 'joelle', 'brady', 'bailey', 'trevor'],
      }
      let result = template.render(templateData, data, { overwrite: true })

      expect(result).to.not.be.false

      expect(result).contain('test')

      done()
    })

    it('should render data using extended template', (done) => {
      let templateFilename = path.join(__dirname, '..', 'test', 'templates', 'extended.eta')

      let templateData = template.readFile(templateFilename)

      const data = {
        name: 'Mike Erickson',
        titleCase: function (str = null) {
          return strings.titleCase(str)
        },
        names: ['mike', 'kira', 'joelle', 'brady', 'bailey', 'trevor'],
      }
      let result = template.render(templateData, data, { extended: true })

      expect(result).to.not.be.false
      expect(result).to.not.be.false

      expect(result).contain('mike, kira, joelle, brady, bailey, trevor')

      // check if names echo'd as list (and using titleCase function)
      expect(result).contain('Mike\n')
      expect(result).contain('Kira\n')
      expect(result).contain('Joelle\n')
      expect(result).contain('Brady\n')
      expect(result).contain('Bailey\n')
      expect(result).contain('Trevor')

      done()
    })
  })

  describe('template module (eta): renderTemplate', (done) => {
    it('should render template using variable', (done) => {
      let templateFilename = path.join(__dirname, '..', 'test', 'templates', 'app.test.eta')

      let destinationFilename = './test.js'

      let result = template.renderTemplate(templateFilename, { name: 'Mike' }, { overwrite: true })

      expect(result).to.not.be.false

      expect(result).contain(`console.log('Hello Mike')`) // eslint-disable-line

      done()
    })

    it('should render template using inline function', (done) => {
      let templateFilename = path.join(__dirname, '..', 'test', 'templates', 'app.test-function.eta')

      let destinationFilename = path.resolve('test-function.js')

      const templateData = {
        name: 'Mike Erickson',
        helloWorld: function (param = '') {
          return param
        },
        names: ['mike', 'kira', 'joelle', 'brady', 'bailey', 'trevor'],
      }
      let result = template.renderTemplate(templateFilename, templateData, { overwrite: true })

      expect(result).to.not.be.false

      expect(result).contain('test')

      done()
    })

    it('should properly handle templates with missing data', (done) => {
      let templateFilename = path.join(__dirname, '..', 'test', 'templates', 'bad-template-data.eta')

      const templateData = {
        names: ['mike', 'kira', 'joelle', 'brady', 'bailey', 'trevor'],
        titleCase: function (str = null) {
          return strings.titleCase(str)
        },
      }

      let result = template.renderTemplate(templateFilename, templateData)

      expect(result.status).equal('fail')
      expect(result.message).equal('name2 is not defined')

      done()
    })

    it('fail when errors occur', (done) => {
      let templateFilename = path.join(__dirname, '..', 'test', 'templates', 'bad-template-missing-tag.eta')

      const templateData = {
        names: ['mike', 'kira', 'joelle', 'brady', 'bailey', 'trevor'],
        titleCase: function (str = null) {
          return strings.titleCase(str)
        },
      }
      let result = template.renderTemplate(templateFilename, templateData, { extended: true })

      expect(result.status).equal('fail')
      expect(result.message).contain('unclosed tag')

      done()
    })
  })

  describe('template module (eta): generateFile', (done) => {
    it('should generate file', (done) => {
      let templateFilename = path.join(__dirname, '..', 'test', 'templates', 'app.test.eta')

      let destinationFilename = './test.js'

      let result = template.generateFile(templateFilename, destinationFilename, { name: 'Mike' }, { overwrite: true })

      expect(result).to.be.false

      filesystem.delete(destinationFilename)

      done()
    })

    it('should generate file using inline function', (done) => {
      let templateFilename = path.join(__dirname, '..', 'test', 'templates', 'app.test-function.eta')

      let destinationFilename = path.resolve('test-function.js')

      const templateData = {
        name: 'Mike Erickson',
        helloWorld: function (param = '') {
          return param
        },
        names: ['mike', 'kira', 'joelle', 'brady', 'bailey', 'trevor'],
      }
      let result = template.generateFile(templateFilename, destinationFilename, templateData, { overwrite: true })

      let renderedData = template.readFile(destinationFilename)

      expect(result).to.be.false

      expect(renderedData).contain('test')

      filesystem.delete(destinationFilename)

      done()
    })

    it('fail when errors occur', (done) => {
      let templateFilename = path.join(__dirname, '..', 'test', 'templates', 'bad-template-missing-tag.eta')

      let destinationFilename = path.resolve('test-array.txt')

      const templateData = {
        names: ['mike', 'kira', 'joelle', 'brady', 'bailey', 'trevor'],
        titleCase: function (str = null) {
          return strings.titleCase(str)
        },
      }

      let result = template.generateFile(templateFilename, destinationFilename, templateData, { overwrite: true })

      expect(result.status).equal('fail')

      done()
    })
  })
})
