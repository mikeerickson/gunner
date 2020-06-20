module.exports = {
  name: 'default',
  description: '',
  usage: 'Do something cool, after all this is your command!',
  flags: {
    message: { aliases: ['m'], description: 'Command message' },
  },
  execute(toolbox) {
    let msg = toolbox.arguments.message || 'Hello World'
    toolbox.print.info(`Default Command: ${msg}`)
  },
}
