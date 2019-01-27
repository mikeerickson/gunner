const print = require('@codedungeon/messenger')

class CLI {
  constructor(argv) {
    this.command = this.getCommand(argv)
    this.arguments = this.getArguments(argv)
    print.info('CLI is configured correctly', 'READY')
    console.log()
    console.log('COMMAND: ', this.command)
    console.log('ARGS: ', this.arguments)
  }
  getCommand(argv) {
    let command = argv.length > 2 ? argv[2] : '<command>'
    if (command[0] == '-') {
      command = ''
    }
    return command
  }
  getArguments(argv) {
    let args = require('yargs-parser')(argv.slice(2))
    if (args.hasOwnProperty('_')) {
      delete args['_']
    }
    return args
  }
}

module.exports = CLI
