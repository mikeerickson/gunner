const { dd, dump } = require('dumper.js')

const globals = {
  init: () => {
    global.dd = (data) => {
      console.log('')
      dd(data)
    }

    global.dump = (data) => {
      console.log('')
      dump(data)
    }
  },
}

module.exports = globals
