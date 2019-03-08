module.exports = {
  name: 'make:command',
  description: 'Create a new gunner command',
  flags: {
    name: { aliases: ['n'], description: 'command name', required: true },
    language: { aliases: ['l'], description: 'language', default: 'php' }
  },
  execute(cli) {
    cli.arguments = cli.setDefaultFlags(cli, this.flags)
    cli.print.important('Command:    ' + this.name)
    cli.print.important('Arguments:  ' + JSON.stringify(cli.arguments).replace(/,/gi, ', '))
  }
}
