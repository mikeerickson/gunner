const os = require('os')
const path = require('path')
const which = require('which')

const config = require('./toolbox/config')
const inspector = require('./inspector.js')
const table = require('./toolbox/table.js')
const system = require('./toolbox/system.js')

const HELP_PAD = 30

class CLI {
  constructor(argv = [], projectRootDir = null) {
    inspector.startup()

    if (argv.length === 0) {
      argv.push(system.which('node'))
      argv.push(system.which('gunner'))
    }

    this.argv = argv
    this.fs = this.filesystem = require('./toolbox/filesystem') // get this early as it will be used during bootstrap
    this.projectRoot = projectRootDir || path.dirname(this.fs.realpathSync(argv[1]))
    this.pkgInfo = require(path.join(this.fs.realpathSync(this.projectRoot), 'package.json'))
    this.version = this.pkgInfo.version
    this.appName = this.pkgInfo.packageName
    this.tagline = this.pkgInfo.tagline || ''
    this.packageName = this.pkgInfo.packageName || ''

    this.command = this.getCommand(argv)
    this.commandName = this.getCommandName(argv) // sub command (see make:command for example)
    this.arguments = this.getArguments(argv)

    // setup global options
    this.verbose = this.arguments.verbose || false
    this.overwrite = this.arguments.overwrite || this.arguments.o
    this.debug = this.arguments.debug || this.arguments.d || false

    // // help is activated
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
    // this.system = system
    this.config = config
    this.path = path
    this.strings = require('voca')
    this.colors = require('colors')
    this.print = require('./toolbox/print')
    this.utils = require('@codedungeon/utils')
    this.template = require('./toolbox/template')

    // load project extensions
    this.loadExtensions(this)

    // each of the following will be displayed when CLI help is requested
    // each object can be customized using associated method when initializing CLI
    // eg .help() .usage() .commands() .options() .examples()
    this.helpInfo = ''
    this.usageInfo = ''
    this.commandInfo = ''
    this.optionInfo = ''
    this.exampleInfo = ''

    this.toolbox = {
      appUtils: require('./utils/cli-utils'),
      arguments: this.arguments,
      colors: this.colors,
      config,
      debug: require('dumper.js'),
      env: {
        appName: this.appName,
        arguments: this.arguments,
        command: this.command,
        commandName: this.commandName,
        debug: this.debug,
        overwrite: this.overwrite,
        packageName: this.packageName,
        projectRoot: this.projectRoot,
        verbose: this.verbose,
        version: this.version,
      },
      filesystem: this.fs,
      fs: this.fs,
      path: this.path,
      print: this.print,
      strings: this.strings,
      system,
      table,
      template: this.template,
      utils: this.utils,
    }

    // show app info
    this.debug && this.verbose ? table.verboseInfo(['Property', 'Value'], Object.entries(this)) : ''
  }

  src(path = '') {
    if (path.length > 0) {
      this.projectRoot = path
    }
    return this
  }

  run(commandInfo = {}) {
    let result = this.handleCommand(this.argv, commandInfo)
    process.exit(result)
  }

  name(name = '') {
    this.packageName = name
    return this
  }

  /**
   * help override methods
   */
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
    if (options.length > 0) {
      this.optionInfo = options
    } else {
      let options = [
        '  --debug, -d                   Debug Mode',
        '  --help, -h, -H                Shows Help (this screen)',
        // '--logs, -l               Output logs to stdout',
        '  --overwrite, -o               Overwrite Existing Files(s) if creating in command',
        '  --version, -v, -V             Show Version',
        '  --verbose                     Verbose Output [only used in conjuction with --debug]',
        this.colors.magenta.italic('                                 (includes table of gunner options)'),
      ]

      this.optionInfo = options.join('\n')
    }
    return this
  }

  examples(examples = '') {
    this.exampleInfo = examples
    return this
  }

  formatInfo(info = '') {
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
    let argsParser = require('minimist')
    let args = argsParser(argv)
    if (args.hasOwnProperty('_')) {
      delete args['_']
    }
    return args
  }

  getExtensionPath() {
    return this.path.join(this.projectRoot, 'src', 'extensions')
  }

  getTemplatePath() {
    return this.path.join(this.projectRoot, 'src', 'templates')
  }

  getCommandPath() {
    return this.path.join(process.cwd(), 'src', 'commands')
  }

  getProjectCommandPath(useShortPath = false) {
    let commandPath = ''
    if (this.projectRoot.length > 0) {
      commandPath = this.path.join(this.projectRoot, 'src', 'commands')
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
    // try kebabCase or camelCase filename
    let files = [
      this.path.join(this.getProjectCommandPath(), this.strings.kebabCase(module) + '.js'),
      this.path.join(this.getProjectCommandPath(), this.strings.camelCase(module) + '.js'),
    ]
    let filename = ''
    let result = files.forEach((file) => {
      if (this.fs.existsSync(file)) {
        filename = file
      }
    })
    return filename.length > 0 ? require(filename) : {}
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
    keys.map((flag) => {
      let alias = flags[flag].aliases[0]
      let defaultValue = this.utils.dot.get(flags[flag].default)
      if (defaultValue === undefined) {
        defaultValue = null
      }
      defaults = Object.assign(defaults, {
        [flag]: this.utils.dot.get(cli.arguments[flag] || this.utils.dot.get(cli.arguments[alias] || defaultValue)),
        [alias]: this.utils.dot.get(cli.arguments[alias] || this.utils.dot.get(cli.arguments[flag] || defaultValue)),
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

    commandFiles.forEach((filename) => {
      if (this.path.extname(filename) == '.js') {
        let module = this.loadModule(this.path.basename(filename, '.js'))
        let disabled = module.disabled || false
        let hidden = module.hidden || false
        if (!disabled && !hidden) {
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
          JSON.stringify(this.arguments).replace(/,/gi, ', ').replace(/:/gi, ': ')

        console.log(this.colors.gray(separator))
        this.print.debug(msg)
        console.log(this.colors.gray(separator))

        process.exit(0)
      }
    }
  }

  showVersion() {
    const name = this.strings.titleCase(this.packageName)
    console.log(`🚧 ${this.colors.cyan(name)} ${this.colors.cyan('v' + this.version)}`)
    console.log(`   ${this.colors.magenta.italic(this.tagline)}`)
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
    keys.forEach((flag) => {
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
      console.log(flags.padEnd(HELP_PAD + 1), description, defaultValue)
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

        let result = module.hasOwnProperty('execute')
        if (module.hasOwnProperty('execute')) {
          this.arguments = this.setDefaultFlags(this, module.flags)
          return module.execute(this.toolbox)
        }
      } else {
        let output = `🚫  Invalid Command: ${command}`
        this.print.error(output)
        return output
      }
    }
  }

  handleCommand(argv, commandInfo = {}) {
    // special handle if default supplied in .run()
    commandInfo = argv.length >= 3 ? {} : commandInfo

    let command = commandInfo.name || this.command
    let args = commandInfo.args || this.arguments

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

  loadExtensions(cli) {
    let extensionPath = this.getExtensionPath()
    if (!cli.fs.existsSync(extensionPath)) {
      this.fs.mkdirSync(extensionPath)
    }
    let extensionFiles = this.fs.readdirSync(extensionPath)
    extensionFiles.forEach((filename) => {
      let extFilename = this.path.join(extensionPath, filename)
      let module = require(extFilename)(cli)
    })

    // cli.test = function (msg = 'default') {
    //   console.log(msg)
    // }
  }
}

module.exports = CLI
