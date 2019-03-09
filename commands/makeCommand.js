module.exports = {
  name: 'make:command',
  description: 'Create a new gunner command',
  flags: {
    name: { aliases: ['n'], description: 'command name', required: true },
    language: { aliases: ['l'], description: 'language', default: 'php', required: true },
    all: { aliases: ['a'], description: 'Use All', default: false },
    some: { aliases: ['s'], description: 'Use Some', default: false }
  },
  execute(cli) {
    cli.arguments = cli.setDefaultFlags(cli, this.flags)
    cli.print.important('Command:    ' + this.name)
    cli.print.important('Arguments:  ' + JSON.stringify(cli.arguments).replace(/,/gi, ', '))
  }
}
