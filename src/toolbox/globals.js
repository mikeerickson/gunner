const print = require('./print')

const globals = {
  init: () => {
    global.dd = (data) => {
      console.log('')
      print.dd(data)
    }

    global.dump = (data) => {
      console.log('')
      print.dump(data)
    }
  },
}

module.exports = globals
