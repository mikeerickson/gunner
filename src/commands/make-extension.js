module.exports = {
  name: 'make:extension',
  description: 'Create new gunner extension',
  disabled: false,
  hidden: false,
  usage: 'gunner make:extension --name helloExtension',
  flags: {
    // example flag, adjust accordingly
    name: { aliases: ['n'], description: 'Extension name', required: true },
  },
  execute(toolbox) {
    // toolbox.print.info(`macOS Version: ${toolbox.machineInfo()}`)
    toolbox.print.log('perform extension creation (see make:command for tips)', 'LOG')
  },
}