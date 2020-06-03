module.exports = {
  name: 'sample',
  description: 'Sample command, displays simple hello message',
  disabled: false,
  hidden: true,
  usage: 'sample --name "john doe"',
  flags: {
    name: { aliases: ['n'], description: 'Sample name', required: false }
  },
  execute(cli) {
    let name = cli.strings.titleCase(cli.arguments.name || 'world')
    cli.print.info(`Sample ${name}`)
  }
}
