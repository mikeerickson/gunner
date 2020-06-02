/* Command Descritption
  Each command has the following keys
    - name: command name (showed in help)
    - descirption: command description (showed in help)
    - usage [option]: description of how to use command (showed in help)
    - flags each flag object contans the following properties
        - name: command name (example make:command)
        - aliases: array of flag aliass
        - description: Command description (displayed when show help)
        - required: optional parameter if flag is required
*/

const chalk = require('chalk')

module.exports = {
  name: 'make:command',
  description: 'Create a new gunner command',
  usage: 'make:command <CommandName> [flags]',
  flags: {
    /* Command Flags:

    */
    name: { aliases: ['n'], description: 'Command name (eg make:command)', required: true },
    description: { aliases: ['d'], description: 'Command description', required: false }
  },
  execute(cli) {
    console.log('')
    cli.arguments = cli.setDefaultFlags(cli, this.flags)
    cli.print.dd(cli.commandName)
    /*
  - you can use the following variables when creating your command
  - cli.commandName
  - cli.command
  - cli.arguments
*/
    let data = {
      name: cli.arguments.name,
      description: cli.arguments.description
    }

    let templateFilename = cli.path.join(cli.getTemplatePath(), 'makeCommand.mustache')
    let templateData = cli.template.render(templateFilename, data)
    if (templateData !== 'TEMPLATE_NOT_FOUND') {
      let currentCommandPath = cli.getCurrentCommandPath()
      if (!cli.fs.existsSync(currentCommandPath)) {
        cli.fs.mkdirSync(currentCommandPath)
        cli.print.info(cli.colors.bold('==> Creating Local `commands` Directory'))
      }
      let commandFilename = cli.path.join(currentCommandPath, cli.commandName + '.js')
      if (cli.arguments.overwrite || cli.overwrite) {
        cli.fs.unlinkSync(commandFilename)
      }
      if (!cli.fs.existsSync(commandFilename)) {
        try {
          let ret = cli.fs.writeFileSync(commandFilename, templateData)
          cli.print.success(`${cli.utils.tildify(commandFilename)} created successfuly`, 'SUCCESS')
        } catch (e) {
          cli.print.error(`Error creating ${cli.utils.tildify(commandFilename)}`, 'ERROR')
        }
      } else {
        cli.print.note(`${cli.utils.tildify(commandFilename)} already exists`, 'NOTE')
      }
    } else {
      cli.print.error(`${cli.utils.tildify(templateFilename)} template not found`, 'ERROR')
    }
  }
}
