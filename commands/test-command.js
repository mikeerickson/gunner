const chalk = require('chalk')

module.exports = {
  name: 'test:command',
  description: 'Create a new gunner command',
  usage: 'make:command <CommandName> [flags]',
  flags: {},
  execute(cli) {
    cli.arguments = cli.setDefaultFlags(cli, this.flags)
    cli.print.info('test:command')
  }
}
