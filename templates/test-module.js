const mustache = require('../src/mustache.js')
const filename = './test.mustache'

const view = {
  title: 'Joe',
  calc: function() {
    return 2 + 4
  }
}

const result = mustache.render(filename, view)
console.log(result)
