const print = require('@codedungeon/messenger')
const pkgInfo = require('../package.json')

class CLI {
  constructor(argv) {
    this.version = pkgInfo.version
    this.packageName = pkgInfo.packageName
    this.tagline = pkgInfo.tagline

    this.command = this.getCommand(argv)
    this.arguments = this.getArguments(argv)

    this.colors = require('colors')
    this.print = print

    this.handleCommand()
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
  showCommands() {
    console.log(this.colors.yellow('  Commands:'))
  }
  showVersion() {
    console.log(`${this.colors.cyan(this.packageName)} v${this.colors.cyan(this.version)}`)
    console.log(`${this.colors.yellow(this.tagline)}`)
  }
  showHelp() {
    if (this.command.length === 0) {
      this.showVersion()
      console.log('')
      this.showCommands()
    } else {
      console.log(`Show ${this.colors.cyan(this.command)} help`)
    }
  }
  handleCommand() {
    let command = this.command
    let args = this.arguments

    if (args.help || args.h) {
      this.showHelp()
      process.exit(0)
    }

    if (args.v || args.version) {
      this.showVersion()
      process.exit(0)
    }

    this.print.debug(`Execute '${command}' using '${JSON.stringify(args, null, 2)}'`)
  }
}

module.exports = CLI
