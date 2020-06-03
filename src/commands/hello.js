/* Command Descritption
 * Filename on disk must match the module name property
 * It will accept kebabCase or camelCase from module name
 * Example name 'hello:world' will find command filename 'helloWorld.js' or 'hello-world.js'
 *
 * Each command has the following keys
 *  - name: command name (showed in help)
 *  - descirption: command description (showed in help)
 *  - usage [option]: description of how to use command (showed in help)
 *   - flags each flag object contans the following properties
 *      - name: command name (example make:command)
 *      - aliases: array of flag aliass
 *      - description: Command description (displayed when show help)
 *      - required: optional parameter if flag is required
 */

module.exports = {
  name: 'hello',
  description: '',
  usage: 'Do something cool, after all this is your command!',
  flags: {
    name: { aliases: ['n'], description: 'Command name', required: false }
  },
  execute(cli) {
    /*
      - you can use the following variables when creating your command
      - cli.commandName
      - cli.command
      - cli.arguments
    */

    // leave this line intact, it will process arguments, applying defaults where applicable
    cli.arguments = cli.setDefaultFlags(cli, this.flags)

    // example processing command
    cli.print.info(`Hello ${cli.arguments.name || 'World'}`)
  }
}
