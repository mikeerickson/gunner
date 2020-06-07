module.exports = {
  name: 'default',
  description: '',
  usage: 'Do something cool, after all this is your command!',
  flags: {
    message: { aliases: ['m'], description: 'Command message' }
  },
  execute(cli) {
    let msg = cli.arguments.message || 'Hello World'
    cli.print.info(`Default Message: ${msg}`)
  }
}
