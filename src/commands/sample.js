module.exports = {
  name: 'sample',
  description: 'Sample command, displays simple hello message',
  disabled: false,
  hidden: true,
  usage: 'sample --name "john doe"',
  flags: {
    name: { aliases: ['n'], description: 'Sample name', required: false },
  },
  execute(toolbox) {
    let name = toolbox.strings.titleCase(toolbox.arguments.name || 'world')
    toolbox.print.info(`Sample ${name}`)
  },
}
