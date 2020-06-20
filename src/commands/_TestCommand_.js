/* Command Descritption
 * Filename on disk must match the module name property
 * It will accept kebabCase or camelCase from module name
 * Example name 'hello:world' will find command filename 'helloWorld.js' or 'hello-world.js'
 *
 * Each command has the following keys
 *  - name: command name (showed in help)
 *  - description: command description (showed in help)
 *  - disabled [optional]: <true|false> if true, the command will not be executable
 *  - hidden [optional]: <true|false> if true, the command will not be available when showing help
 *  - usage [optional]: description of how to use command (showed in help)
 *   - flags [object]: each flag object contains the following properties
 *      - name: command name (example make:command)
 *      - aliases [optional]: array of flag aliass
 *      - description [optional: Command description (displayed when show help)
 *      - required [optional]: <true|false> optional parameter if flag is required
 */

module.exports = {
  name: '',
  description: '',
  disabled: false,
  hidden: false,
  usage: 'Do something cool, after all this is your command!',
  flags: {
    // example flag, adjust accordingly
    name: { aliases: ['n'], description: 'Command name', required: false }
  },
  execute(cli) {
    /*
     * - you can use the following variables when creating your command
     * - cli.commandName
     * - cli.command
     * - cli.arguments
     */

		// example processing command
    let name = cli.strings.titleCase(cli.arguments.name || 'world')
  }
}
