module.exports = {
  name: 'hello',
  description: 'Say Hello to My LIttle Friend',
  flags: {
    name: { aliases: ['n'], description: 'Name', default: 'World', required: false }
  },
  execute(cli) {
    cli.arguments = cli.setDefaultFlags(cli, this.flags)
    this.handle(cli)
  },
  handle(cli) {
    let commandPath = cli.getProjectCommandPath()
    let name = cli.strings.titleCase(cli.arguments.name)
    cli.print.info(`Hello ${name}`, 'INFO')
  }
}
