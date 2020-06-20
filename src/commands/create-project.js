/*
 - create commands directory
  - create sample command (hello-world.js)
 - initialize package.json
 - create ./index.js
 - create config file (.myapprc.json or myapp.config.js)

*/

module.exports = {
  name: 'create:project',
  description: 'Generate New toolbox Application',
  usage: 'create:project --name <command> <flags>',
  flags: {
    name: { aliases: ['n'], description: 'Command name', required: true },
    description: { aliases: ['n'], description: 'Command name', required: true },
  },
  execute(toolbox) {
    // create folder
    // create package.json
    // create base index
    toolbox.print.info(toolbox.arguments)
    toolbox.print.information(`Name: ${toolbox.arguments.name}`)
    toolbox.print.info(`Hello ${toolbox.arguments.name}`, 'INFO')
  },
}
