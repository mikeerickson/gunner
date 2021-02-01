const colors = require('colors')

class Environment {
  constructor(msg = 'World') {
    this.msg = msg
  }
  sayHello(msg = null) {
    if (msg === null) {
      msg = this.msg
    }
    console.log(colors.green.bold(`Hello ${msg}`))
  }
}

module.exports = Environment
