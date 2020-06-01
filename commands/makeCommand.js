module.exports = {
  name: 'make:command',
  description: 'Create a new gunner command',
  flags: {
    name: { aliases: ['n'], description: 'command name', required: false },
    language: { aliases: ['l'], description: 'language', default: 'php', required: false }
  },
  execute(cli) {
    cli.arguments = cli.setDefaultFlags(cli, this.flags)
    cli.print.important('Command:       ' + this.name)
    cli.print.important('Command Name:  ' + cli.commandName)
    cli.print.important('Arguments:     ' + JSON.stringify(cli.arguments).replace(/,/gi, ', '))
  }
}
