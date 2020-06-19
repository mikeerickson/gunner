module.exports = {
  name: 'make:command',
  description: 'Create new gunner command',
  usage: 'make:command <CommandName> [flags]',
  flags: {
    name: { aliases: ['n'], description: 'Command name (eg make:command)', required: false },
    description: { aliases: ['d'], description: 'Command description', required: false },
  },
  execute(cli) {
    if (cli.arguments.name === null) {
      let cmdName = cli.strings.kebabCase(cli.commandName)
      cli.arguments.name = cmdName
    }

    let data = {
      name: cli.arguments.name,
      description: cli.arguments.description,
    }

    console.log('')
    let templateFilename = cli.path.join(cli.getTemplatePath(), 'make-command.mustache')
    let templateData = cli.template.process(templateFilename, data)

    if (templateData !== 'TEMPLATE_NOT_FOUND') {
      let currentCommandPath = cli.getCurrentCommandPath()
      if (!cli.fs.existsSync(currentCommandPath)) {
        cli.fs.mkdirSync(currentCommandPath, { recursive: true })
        cli.print.info(cli.colors.bold('==> Creating Local `commands` Directory'))
      }
      // check if command name has file extension, if not use ".js"
      let fileExtension = cli.path.extname(cli.commandName)
      fileExtension = fileExtension.length > 0 ? '' : '.js'

      let commandFilename = cli.path.join(currentCommandPath, cli.commandName + fileExtension)
      if (cli.arguments.overwrite || cli.overwrite) {
        cli.fs.existsSync(commandFilename) ? cli.fs.unlinkSync(commandFilename) : null
      }
      if (!cli.fs.existsSync(commandFilename)) {
        try {
          let ret = cli.fs.writeFileSync(commandFilename, templateData)
          cli.print.success(`${cli.utils.tildify(commandFilename)} created successfully`, 'SUCCESS')
        } catch (e) {
          cli.print.error(`Error creating ${cli.utils.tildify(commandFilename)}`, 'ERROR')
        }
      } else {
        cli.print.note(`${cli.utils.tildify(commandFilename)} already exists`, 'NOTE')
      }
    } else {
      cli.print.error(`${cli.utils.tildify(templateFilename)} template not found`, 'ERROR')
    }
  },
}
