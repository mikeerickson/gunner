const path = require('path')
const HELP_PAD = 30

// TODO: make sure all these methods are clean (final)

class CLI {
  constructor(argv, projectRoot = '') {
    this.projectRoot = projectRoot || process.env.ROOT || ''
    this.pkgInfo = require(path.join(this.projectRoot, 'package.json'))

    this.version = this.pkgInfo.version
    this.packageName = this.pkgInfo.packageName || ''
    this.tagline = this.pkgInfo.tagline || ''

    this.command = this.getCommand(argv)
    this.arguments = this.getArguments(argv)
    this.debug = this.arguments.debug || this.arguments.d

    /**
     * setup cli toolbox
     * */
    this.path = path
    this.fs = require('fs-extra')
    this.colors = require('colors')
    this.utils = require('@codedungeon/utils')
    this.print = require('@codedungeon/messenger')
    this.strings = require('voca')

    this.helpInfo = ''
    this.usageInfo = ''
    this.commandInfo = ''
    this.optionInfo = ''
    this.exampleInfo = ''

    /**
     * start CLI
     */
    // this.handleCommand()
  }
  run() {
    this.handleCommand()
  }
  usage(usage = '') {
    this.usageInfo = usage
    return this
  }
  help(help = '') {
    this.helpInfo = help
    return this
  }
  commands(command = '') {
    this.commandInfo = command
    return this
  }
  options(options = '') {
    this.optionInfo = options
    return this
  }
  examples(examples = '') {
    this.exampleInfo = examples
    return this
  }
  getCommand(argv) {
    let command = argv.length > 2 ? argv[2] : '<command>'
    if (command[0] == '-') {
      command = ''
    }
    return command
  }
  getArguments(argv) {
    let args = require('yargs-parser')(argv.slice(2))
    if (args.hasOwnProperty('_')) {
      delete args['_']
    }
    return args
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
        if (!args.hasOwnProperty(flag)) {
          missingArguments.push(flag)
        }
      }
    }
    return missingArguments
  }
  setDefaultFlags(cli, flags) {
    if (flags === undefined) {
      return {}
    }
    let args = {}
    let keys = Object.keys(flags)
    keys.forEach(key => {
      args[key] = null
      if (flags[key].hasOwnProperty('aliases')) {
        let alias = flags[key]['aliases']
        if (typeof alias === 'string') {
          alias = flags[key]['aliases'].replace('-', '')
        }
        args[alias] = null
      }
    })

    keys.forEach(flag => {
      if (flags[flag].hasOwnProperty('aliases')) {
        let defaultType = typeof flags[flag]['default']
        let alias = flags[flag]['aliases']
        if (typeof alias === 'string') {
          alias = alias.replace('-', '')
        }

        let defaultValue = cli.arguments[alias] || cli.arguments[flag]
        if (typeof defaultValue !== defaultType) {
          defaultValue = flags[flag]['default']
        }
        (defaultValue === undefined) ? false : defaultValue

        if (cli.arguments.hasOwnProperty(flags[flag].aliases[0])) {
          args[flag] = defaultValue
          args[flags[flag].aliases[0]] = defaultValue
        } else {
          if (cli.arguments.hasOwnProperty(flag)) {
            args[flag] = args[alias] = args[flag] || args[alias] || cli.arguments[flag]
          } else {
            if (flags.hasOwnProperty('required')) {
              args[flag] = args[alias] = args[flag] || args[alias] || defaultValue
            }
          }
        }
      } else {
        let defaultType = typeof flags[flag]['default']
        let defaultValue = cli.arguments[flag]
        if (typeof defaultValue !== defaultType) {
          defaultValue = flags[flag]['default']
        }
        args[flag] = args[flag] || defaultValue
      }
    })
    return args
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
  }
  showHelp() {
    // if we have defined custom help, display it
    if (this.help.length > 0) {
      return this.print.log(this.helpInfo)
    }

    // otherwise build CLI help
    if (this.command.length === 0) {
      console.log('')
      this.showVersion()
      console.log('')
      this.print.warning('Usage:')
      console.log(this.usageInfo + '\n')

      this.print.warning('Commands:')
      if (this.commandInfo.length > 0) {
        this.print.log(this.commandInfo + '\n')
      } else {
        let commands = this.showCommands()
        if (commands.length > 0) {
          this.print.log(commands)
        }
      }
      if (this.optionInfo.length > 0) {
        this.print.warning('Options:')
        this.print.log(this.optionInfo + '\n')
      }

      if (this.exampleInfo.length > 0) {
        this.print.warning('Examples:')
        this.print.log(this.exampleInfo + '\n')
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

    console.log('')
    console.log(this.colors.yellow('Usage:'))
    console.log(`  ${this.packageName} ${command} <options>`)

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

    if (this.argumentHasOption(args, ['H', 'h', 'help'])) {
      this.showHelp()
      process.exit(0)
    }

    if (this.argumentHasOption(args, ['V', 'version'])) {
      this.showVersion()
      process.exit(0)
    }

    this.debug ? this.showDebugCommand(command) : null

    return command.length > 0 ? this.executeCommand(command, args) : this.showHelp(this.appName)
  }
}

module.exports = CLI
