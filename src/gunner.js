const path = require('path')
const fs = require('fs')

const HELP_PAD = 30

class CLI {
  constructor(argv) {
    this.projectRoot = path.dirname(fs.realpathSync(argv[1]))
    let packageJsonFilename = path.join(fs.realpathSync(this.projectRoot), 'package.json')
    this.pkgInfo = require(packageJsonFilename)

    this.version = this.pkgInfo.version
    this.packageName = this.pkgInfo.packageName || ''
    this.tagline = this.pkgInfo.tagline || ''

    this.command = this.getCommand(argv)
    this.commandName = this.getCommandName(argv)
    this.arguments = this.getArguments(argv)
    this.debug = this.arguments.debug || this.arguments.d
    this.overwrite = this.arguments.overwrite || this.arguments.o

    // help is activated
    if (this.arguments.help || this.arguments.h || this.arguments.H) {
      this.arguments.help = this.arguments.h = this.arguments.H = true
    }

    // version is activated
    if (this.arguments.version || this.arguments.v || this.arguments.V) {
      this.arguments.version = this.arguments.v = this.arguments.V = true
    }

    /**
     * setup cli toolbox
     * */
    this.path = path
    this.fs = require('fs-extra')
    this.colors = require('colors')
    this.utils = require('@codedungeon/utils')
    this.print = require('@codedungeon/messenger')
    this.strings = require('voca')
    this.template = require('./template')

    this.helpInfo = ''
    this.usageInfo = ''
    this.commandInfo = ''
    this.optionInfo = ''
    this.globalOptionInfo = ''
    this.exampleInfo = ''
  }
  /**
   * run()
   * kicks off CLI program
   *
   * @memberof CLI
   */
  run(commandInfo = {}) {
    this.handleCommand()
  }
  usage(usage = '') {
    this.usageInfo = usage
    return this
  }
  /**
   * help()
   * overrides default help data
   * @note If help is supplied, the comamnds, examples, options, usage methods are not used
   *
   * @param {string} [help='']
   * @returns
   * @memberof CLI
   */
  help(help = '') {
    this.helpInfo = help
    return this
  }

  /**
   * Overrides default command output when using --help flag
   * @note: If custom help is used, this information will not be displayed
   *
   * @param {string} [command='']
   * @returns
   * @memberof CLI
   */
  commands(command = '') {
    this.commandInfo = command
    return this
  }

  globalOptions(options = '') {
    if (options.length > 0) {
      this.globalOptionInfo = options
    } else {
      let globalOptions = ['  --overwrite, -o              Overwrite Existing Files(s)']
      this.globalOptionInfo = globalOptions.join('\n')
    }
    return this
  }
  /**
   * Overrides default options output when using --help flag
   * @note: If custom help is used, this information will not be displayed
   *
   * @param {string} [options='']
   * @returns
   * @memberof CLI
   */
  options(options = '') {
    // if options is cleared, show default.
    // - Custom Options should be >1 char
    if (options.length > 0) {
      this.optionInfo = options
    } else {
      let options = [
        '--debug, -d                    Debug Mode',
        '--help, -h, -H                 Shows Help (this screen)',
        // '--logs, -l               Output logs to stdout',
        '--version, -v, -V              Show Version'
      ]

      this.optionInfo = options.join('\n')
    }
    return this
  }

  name(name = '') {
    this.packageName = name
    return this
  }

  /**
   * Overrides default examples output when using --help flag
   * @note: If custom help is used, this information will not be displayed
   * @param {string} [examples='']
   * @returns
   * @memberof CLI
   */
  examples(examples = '') {
    this.exampleInfo = examples
    return this
  }

  formatInfo(info = '') {
    // TODO: Fix
    // parse lines
    // indent each line 2 spaces
    // return formatted line
    return '  ' + info
  }

  getCommand(argv) {
    let command = argv.length > 2 ? argv[2] : '<command>'
    if (command[0] == '-') {
      command = ''
    }
    return command
  }
  getCommandName(argv) {
    let parseArgs = require('minimist')
    let parsedArguments = parseArgs(argv)
    return parsedArguments._.length >= 4 ? parsedArguments._[3] : ''
  }
  getArguments(argv) {
    let args = require('mri')(argv.slice(2))
    if (args.hasOwnProperty('_')) {
      delete args['_']
    }
    return args
  }
  getTemplatePath() {
    let cmdPath = this.getProjectCommandPath()
    let templatePath = this.path.join(cmdPath, 'templates')
    return templatePath
  }
  getProjectCommandPath(useShortPath = false) {
    let commandPath = ''
    if (this.projectRoot.length > 0) {
      commandPath = this.path.join(this.projectRoot, 'commands')
    } else {
      commandPath = this.path.join(process.env.CWD || process.env.PWD, 'commands')
    }
    if (!this.fs.existsSync(commandPath)) {
      this.fs.mkdirSync(commandPath)
    }
    if (useShortPath) {
      commandPath = this.utils.tildify(commandPath)
    }
    return commandPath
  }
  getCurrentCommandPath() {
    return this.path.join(process.cwd(), 'commands')
  }
  isModuleValid(module) {
    return this.utils.has(module, 'name') ** this.utils.has(module, 'run')
  }
  loadModule(module = '') {
    module = this.strings.camelCase(module) // normalize string
    let filename = this.path.join(this.getProjectCommandPath(), module + '.js')
    if (this.fs.existsSync(filename)) {
      return require(filename)
    }
    return {}
  }
  hasRequiredArguments(module, args) {
    let missingArguments = []
    for (let flag in module.flags) {
      if (module.flags[flag].hasOwnProperty('required') && module.flags[flag].required) {
        let hasAlias = false
        if (!args.hasOwnProperty(flag)) {
          if (module.flags[flag].hasOwnProperty('aliases')) {
            let alias = module.flags[flag].aliases[0]
            hasAlias = args.hasOwnProperty(alias)
          }
          !hasAlias ? missingArguments.push(flag) : null
        }
      }
    }
    return missingArguments
  }
  setDefaultFlags(cli, flags) {
    let keys = Object.keys(flags)
    let defaults = {}
    keys.map(flag => {
      let alias = flags[flag].aliases[0]
      let defaultValue = this.utils.dot.get(flags[flag].default)
      if (defaultValue === undefined) {
        defaultValue = null
      }
      defaults = Object.assign(defaults, {
        [flag]: this.utils.dot.get(cli.arguments[flag] || this.utils.dot.get(cli.arguments[alias] || defaultValue)),
        [alias]: this.utils.dot.get(cli.arguments[alias] || this.utils.dot.get(cli.arguments[flag] || defaultValue))
      })
    })
    return defaults
  }
  argumentHasOption(args, needles) {
    if (typeof needles === 'undefined') {
      return false
    }
    let items = typeof needles === 'string' ? needles.split(',') : needles
    for (let i = 0; i < items.length; i++) {
      if (items[i] === undefined) {
        return false
      }
      const element = items[i].replace(/-/gi, '')
      if (args.hasOwnProperty(element)) {
        return true
      }
    }
    return false
  }
  getOptionValue(args, optName) {
    if (this.argumentHasOption(args, optName)) {
      let options = typeof optName === 'string' ? [optName] : optName
      for (let i = 0; i < options.length; i++) {
        let option = options[i].replace(/-/gi, '')
        if (args.hasOwnProperty(option)) {
          return args[option]
        }
      }
      return ''
    }
    return ''
  }

  /**
   * CLI Interface Commands
   */
  showCommands() {
    let commandPath = this.getProjectCommandPath()
    let commandFiles = this.fs.readdirSync(commandPath)
    let commands = ''
    let projectHome = this.colors.cyan('.' + commandPath.replace(process.env.PWD, ''))

    if (commandFiles.length === 0) {
      commands += this.colors.red('  There are no defined commands\n')
      commands += this.colors.red(`  Please review your ${projectHome} directory\n`)
    }

    commandFiles.forEach(filename => {
      if (this.path.extname(filename) == '.js') {
        // console.log(this.path.basename(filename, '.js'))
        let module = this.loadModule(this.path.basename(filename, '.js'))
        let disabled = module.disabled || false
        if (!disabled) {
          let name = module.name || ''
          if (module.hasOwnProperty('flags')) {
            if (Object.keys(module.flags).length > 0) {
              name += ' <options>'
            }
          }
          let description = module.description || `${module.name} command`
          if (name.length > 0) {
            commands += '  ' + name.padEnd(HELP_PAD) + description + '\n'
          }
        }
      }
    })
    return commands
  }
  showDebugCommand(command) {
    if (this.debug) {
      let separator = '='.repeat(this.utils.windowSize().width)
      if (command !== undefined && command !== '') {
        command += ' ' + this.commandName
        console.log('\n')
        let msg =
          ' 🚦  DEBUG COMMAND: ' +
          command +
          '\n    ' +
          JSON.stringify(this.arguments)
            .replace(/,/gi, ', ')
            .replace(/:/gi, ': ')

        console.log(this.colors.gray(separator))
        this.print.debug(msg)
        console.log(this.colors.gray(separator))

        process.exit(0)
      }
    }
  }
  showVersion() {
    console.log(`${this.colors.cyan(this.packageName)} ${this.colors.cyan('v' + this.version)}`)
    console.log(`${this.colors.yellow(this.tagline)}`)
    console.log()
  }
  showHelp() {
    // if we have defined custom help, display it
    if (this.helpInfo.length > 0) {
      return this.print.log(this.helpInfo)
    }

    // otherwise build CLI help
    if (this.command.length === 0) {
      console.log('')
      this.showVersion()

      if (this.usageInfo.length > 0) {
        this.print.warning('Usage:')
        console.log(this.formatInfo(this.usageInfo) + '\n')
      }

      this.print.warning('Commands:')
      if (this.commandInfo.length > 0) {
        this.print.log(this.commandInfo + '\n')
      } else {
        let commands = this.showCommands()
        if (commands.length > 0) {
          this.print.log(commands)
        }
      }

      if (this.optionInfo.length > 1) {
        this.print.warning('Options:')
        this.print.log(this.optionInfo + '\n')
      }

      if (this.globalOptionInfo.length > 1) {
        this.print.warning('Global Options:')
        this.print.log(this.globalOptionInfo + '\n')
      }

      if (this.exampleInfo.length > 0) {
        this.print.warning('Examples:')
        this.print.log(this.formatInfo(this.exampleInfo) + '\n')
      }
    } else {
      this.showCommandHelp(this.command)
    }
  }
  showCommandHelp(command = '') {
    if (this.commandInfo.length > 0) {
      return this.commandInfo
    }
    let module = this.loadModule(command)

    if (!this.utils.has(module, 'name')) {
      console.log(this.colors.red(`\n🚫  An internal error occurred access ${command}`))
      process.exit(1)
    }
    if (module.disabled) {
      console.log(this.colors.red(`\n🚫  Invalid Command: ${command}`))
      process.exit(1)
    }
    console.log('')
    console.log(this.colors.cyan(`⚙️  ${module.name}`))

    // show module description, or built description if property does not exist
    let description = this.utils.has(module, 'description') ? module.description : `${module.name} command`
    console.log(`   ${description}`)

    if (module.hasOwnProperty('usage')) {
      this.print.warning('\nUsage:')
      console.log('  ' + module.usage)
    }

    console.log('')
    if (!module.hasOwnProperty('flags')) {
      process.exit(0)
    }
    let keys = Object.keys(module.flags)
    console.log(this.colors.yellow('Options:'))
    keys.forEach(flag => {
      const description = module.flags[flag]['description'] || module.flags[flag]

      let defaultValue = ''
      if (module.flags[flag].hasOwnProperty('default')) {
        defaultValue = this.colors.cyan('[default: ' + module.flags[flag].default + ']')
        defaultValue = defaultValue.replace(/,/gi, ', ')
      }
      let aliases = ''
      if (module.flags[flag].hasOwnProperty('aliases')) {
        aliases = ', ' + '-' + module.flags[flag].aliases
      }

      let flags = '  --' + flag + aliases
      console.log(flags.padEnd(HELP_PAD), description, defaultValue)
    })

    if (this.globalOptionInfo.length > 0) {
      console.log(this.colors.yellow('\nGlobal Options:'))
      console.log(this.globalOptionInfo)
    }

    return `${module.name} help displayed`
  }
  executeCommand(command, args) {
    if (command.length > 0) {
      let module = this.loadModule(command)
      if (!this.isModuleValid(module)) {
        this.print.error(`🚫  An error occurred accessing: ${command}`)
        process.exit(1)
      }
      let disabled = module.disabled || false
      if (!disabled) {
        let requiredArguments = this.hasRequiredArguments(module, this.arguments)
        if (requiredArguments.length > 0) {
          let output = '\n🚫  Missing Required Arguments:\n'
          output += '   - ' + requiredArguments.join(', ')
          this.print.error(output)
          return output
        }

        let result = module.hasOwnProperty('execute')
        if (module.hasOwnProperty('execute')) {
          return module.execute(this)
        }
      } else {
        let output = `🚫  Invalid Command: ${command}`
        this.print.error(output)
        return output
      }
    }
  }
  handleCommand() {
    let command = this.command
    let args = this.arguments

    // if command not supplied, show help regardless
    if (command === '<command>') {
      this.command = ''
      command = ''
    }

    if (this.argumentHasOption(args, ['V', 'version'])) {
      console.log()
      this.showVersion()
      process.exit(0)
    }

    this.debug ? this.showDebugCommand(command) : null

    if (this.command.length > 0 && this.arguments.help) {
      return this.showCommandHelp(this.command)
    }

    return command.length > 0 ? this.executeCommand(command, args) : this.showHelp(this.appName)
  }
}

module.exports = CLI
