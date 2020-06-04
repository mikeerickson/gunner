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
