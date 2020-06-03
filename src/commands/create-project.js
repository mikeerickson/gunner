/*
 - create commands directory
  - create sample command (hello-world.js)
 - initialize package.json
 - create ./index.js
 - create config file (.myapprc.json or myapp.config.js)

*/

module.exports = {
  name: 'create:project',
  description: 'Generate New CLI Application',
  usage: 'create:project --name <command> <flags>',
  flags: {
    name: { aliases: ['n'], description: 'Command name', required: true },
    description: { aliases: ['n'], description: 'Command name', required: true }
  },
  execute(cli) {
    // create folder
    // create package.json
    // create base index
    cli.arguments = cli.setDefaultFlags(cli, this.flags)
    cli.print.information('Name: ', cli.arguments.name)
    cli.print.info(`Hello ${cli.arguments.name}`)
  }
}
