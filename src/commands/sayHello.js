module.exports = {
  name: 'say-hello',
  description: 'Say hello to my little friend!',
  usage: 'Do something cool, after all this is your command!',
  flags: {
    name: { aliases: ['n'], description: 'Command name' }
  },
  execute(cli) {
    let name = cli.strings.titleCase(cli.arguments.name || 'world')
    cli.print.success(`Hello ${name}!`, 'SUCCESS')
  }
}
