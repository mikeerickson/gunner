const Mustache = require('mustache')
let filename = './test.mustache'
const fs = require('fs')

let templateData = fs.readFileSync(filename).toString()

var view = {
  title: 'Joe',
  calc: function() {
    return 2 + 4
  }
}

var output = Mustache.render(templateData, view)

console.log(output)
