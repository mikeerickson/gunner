/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const App = require('./toolbox/App')

const path = require('path')
const colors = require('chalk')
const semver = require('semver')
const shell = require('shelljs')
const datetime = require('dayjs')
const debug = require('dumper.js')
const tildify = require('tildify')
const api = require('./toolbox/api')
const arrays = require('./toolbox/arrays')
const config = require('./toolbox/config')
const helpers = require('./toolbox/helpers')
const prompts = require('./toolbox/prompt')
const table = require('./toolbox/table.js')
const utils = require('@codedungeon/utils')
const strings = require('./toolbox/strings')
const system = require('./toolbox/system.js')
const template = require('./toolbox/template')
const filesystem = require('./toolbox/filesystem')
const environment = require('./toolbox/environment')
const print = require('./toolbox/print')(this.quiet)
const packageManager = require('./toolbox/packageManager')

const Messenger = require('@codedungeon/messenger')

const HELP_PAD = 30
const REQUIRED_MARK = '✖︎'

const log = (command, resource, args) => {
  if (resource?.length === 0) {
    return
  }

  let cmd = ''
  Object.keys(args).forEach((item) => {
    if (item !== 'anonymous' && item !== 'sub' && item !== 'log' && item.length > 1) {
      cmd += typeof args[item] === 'boolean' ? '--' + item + ' ' : '--' + item + ' ' + args[item] + ' '
    }
  })

  cmd = `${command} ${resource} ${cmd}`.trim()
  Messenger.loggerDebug(cmd)
}

class CLI {
  constructor(argv = [], projectRootDir = null, pkgInfo = null) {
    if (pkgInfo && pkgInfo.name === '@codedungeon/gunner') {
      require('./inspector.js').startup()
    }

    if (argv.length === 0) {
      argv.push(system.which('node'))
      argv.push(system.which('gunner'))
    }

    // load CLI globals
    require('./toolbox/globals').init()

    this.argv = argv
    this.fs = this.filesystem = require('./toolbox/filesystem') // get this early as it will be used during bootstrap
    this.projectRoot = projectRootDir || path.dirname(path.dirname(this.fs.realpathSync(argv[1])))

    this.app = new App({ projectRoot: this.projectRoot })

    this.pkgInfo = require(path.join(this.fs.realpathSync(this.projectRoot), 'package.json'))
    this.versionInfo = this.pkgInfo.version
    this.name = this.pkgInfo.name
    this.appName = this.pkgInfo.packageName
    this.packageName = this.pkgInfo.packageName
    this.author = this.pkgInfo.author || ''
    this.contributors = this.pkgInfo.contributors || []
    this.packageName = this.pkgInfo.packageName || ''

    this.command = this.getCommand(argv)

    this.commandName = this.getCommandName(argv) // sub command (see make:command for example)

    this.arguments = this.getArguments(argv, this)

    // setup global options
    this.verbose = this.arguments.verbose || false // dont add shortcut -v as that is reserved for version
    this.debug = this.arguments.debug || false
    this.overwrite = this.arguments.overwrite || this.arguments.o || false
    this.help = this.arguments.help || this.arguments.h || this.arguments.H || false
    this.quiet = this.arguments.quiet || this.arguments.q || false

    // help is activated
    if (this.arguments.help || this.arguments.h || this.arguments.H) {
      this.arguments.help = this.arguments.h = this.arguments.H = true
    }

    // version is activated
    if (this.arguments.version || this.arguments.v || this.arguments.V) {
      this.arguments.version = this.arguments.v = this.arguments.V = true
    }

    this.helpInfo = ''
    this.usageInfo = ''
    this.commandInfo = ''
    this.optionInfo = ''
    this.exampleInfo = ''
    this.versionStr = ''
    this.hookData = {}

    /** Setup Toolbox */
    this.toolbox = {
      // toolbox properties (some replication, see `env` for more properties)
      appName: this.packageName,
      version: this.versionInfo,
      packageName: this.packageName,

      getOptionValue: this.getOptionValue,
      argumentHasOption: this.argumentHasOption,
      logToFile: log,

      // toolbox modules
      api,
      app: this.app,
      arguments: this.arguments,
      commandName: this.commandName,
      colors,
      config,
      debug,
      env: {
        appName: this.appName,
        arguments: this.arguments,
        command: this.command,
        commandName: this.commandName,
        name: this.name,
        debug: this.debug,
        overwrite: this.overwrite,
        packageName: this.packageName,
        projectRoot: this.projectRoot,
        verbose: this.verbose,
        version: this.versionInfo,
      },
      filesystem: this.fs,
      fs: this.fs,
      datetime,
      path,
      packageManager,
      prompts,
      print,
      semver,
      strings,
      arrays,
      shell,
      system,
      table,
      template,
      utils,
    }

    // load project extensions (will be appended to app namespace)
    this.loadExtensions(this)

    // show gunner object properties if debug mode and verbose options supplied
    this.debug && this.verbose ? this.toolbox.table.verboseInfo(['Property', 'Value'], Object.entries(this)) : ''

    return this
  }

  src(path = '') {
    if (path.length > 0) {
      this.projectRoot = path
    }
    return this
  }

  run(commandInfo = {}) {
    return this.handleCommand(this.argv, commandInfo)
  }

  name(name = '') {
    this.packageName = name
    return this
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
    let optionsType = typeof options
    if (optionsType === 'string' && options.length > 0) {
      this.optionInfo = options
    } else {
      let globalOptions = [
        '  --debug, -d                   Debug Mode',
        '  --help, -h, -H                Shows Help (this screen)',
        '  --log-dir                     Log directory (if different than default)',
      ]

      if (Array.isArray(options)) {
        options.forEach((item) => {
          globalOptions.push(`  --${item.option}`.padEnd(32) + item?.description)
        })
      }

      globalOptions.push('  --quiet, -q                   Quiet mode (suppress console output)')
      globalOptions.push('  --version, -v, -V             Show Version')

      globalOptions.sort()
      this.toolbox.globalOptions = globalOptions

      this.optionInfo = globalOptions.join('\n')
    }
    return this
  }

  version(version = '') {
    if (version.length > 0) {
      this.versionStr = version
    }
    return this
  }

  logger(userOptions = null) {
    let options = { ...{ directory: 'system', filename: null, alwaysLog: false }, ...userOptions }

    if (options.alwaysLog) {
      this.toolbox.arguments.log = true
    }
    if (this.toolbox.arguments?.log) {
      let logName = options.filename
        ? options.filename
        : this.pkgInfo.name.replace('@codedungeon/', '').replace('/', '-')

      Messenger.initLogger(true, options.directory, logName)
    }
    return this
  }

  hooks(data = {}) {
    this.hookData = { ...data }
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

    // command name will be 4th position
    if (argv.length >= 4 && argv[3].startsWith('-')) {
      return ''
    }
    // do some hacking if argv contains --constructor
    let idx = argv.indexOf('--constructor')
    if (idx >= 0) {
      argv[idx] = ':constructor:'
    }

    // parse arguments
    let parsedArguments = parseArgs(argv)

    // restore --constructor if it exiss
    if (idx >= 0) {
      argv[idx] = '--constructor'
    }

    let commandName = parsedArguments._.length >= 4 ? parsedArguments._[3] : ''

    return commandName
  }

  getArguments(argv, module) {
    let parseArgs = require('minimist')

    // need to hack around a bit here since minimist thinks --constructor argument is bad
    let idx = argv.indexOf('--constructor')
    if (idx >= 0) {
      argv[idx] = '--tempConstructor' // quick rename
    }

    // now parse with possible temporary constructor argment
    let args = parseArgs(argv)

    // and if we did have a --construtor argument, restore
    if (idx >= 0) {
      args.constructor = true
      delete args['tempConstructor']
    }

    let argKeys = Object.keys(args)

    if (args.hasOwnProperty('_')) {
      delete args['_']
    }

    if (args) {
      let moduleRef = this.loadModule(module)
      if (moduleRef) {
        Object.keys(args).forEach((arg) => {
          if (moduleRef?.flags?.arg) {
            if (moduleRef.flags[arg].aliases) {
              const aliases = moduleRef.flags[arg].aliases
              aliases.forEach((alias) => {
                args[alias] = args[arg]
              })
            }
          }
        })

        // see if argument has an associated alias
        if (moduleRef?.flags) {
          const flags = Object.keys(moduleRef.flags)
          flags.forEach((flag) => {
            moduleRef.flags[flag]?.aliases?.forEach((alias) => {
              argKeys.includes(alias) ? (args[flag] = args[alias]) : null
            })
          })
        }
      }
    }

    return args
  }

  isModuleValid(module) {
    let hidden = module?.hidden
    if (module?.name) {
      if (module.name === 'default') {
        hidden = false
      }
    }

    return this.toolbox.utils.has(module, 'name') //  && !hidden
  }

  isValidCommand(command) {
    const commands = this.app.getCommandList()
    return commands.includes(command)
  }

  loadModuleByCommand(command = null) {
    let commandFiles = this.filesystem.directoryList(this.app.getCommandPath(), { filesOnly: true })
    for (let index = 0; index < commandFiles.length; index++) {
      let module = require(commandFiles[index])
      if (module?.name === command) {
        return module
      }
    }
    return {}
  }

  loadModule(commandName = '') {
    let filename = ''
    let commands = filesystem.directoryList(this.app.getCommandPath(), { filesOnly: true })
    commands.forEach((file) => {
      let module = require(file)
      if (module?.name && module?.name === commandName) {
        filename = file
      }
    })

    return filename.length > 0 ? require(filename) : {}
  }

  hasRequiredArguments(module, args) {
    let missingArguments = []
    for (let flag in module.flags) {
      let hasPrompt = module.flags[flag]?.prompt && module?.usePrompts
      if (module.flags[flag]?.required && module.flags[flag].required && !hasPrompt) {
        let hasAlias = false
        if (!args[flag]) {
          if (module.flags[flag]?.aliases) {
            let alias = module.flags[flag].aliases[0]
            hasAlias = args?.alias
          }

          if (module.flags[flag]?.description) {
            !hasAlias ? missingArguments.push(module.flags[flag].description) : null
          } else {
            !hasAlias ? missingArguments.push(flag) : null
          }
        }
      }
    }

    return missingArguments
  }

  validateArguments(args, flags) {
    let valid = { status: true }
    // debug.dd({ args, flags })
    // if command does not have flags, it will be valid
    if (flags) {
      Object.keys(flags).forEach((item) => {
        let flagType = flags[item]?.type ? flags[item].type : 'any'
        let value = args.hasOwnProperty(item) ? args[item] : null
        if (flagType === 'boolean') {
          if (typeof value === 'string' && flagType === 'boolean') {
            if (value === 'false') {
              value = false
            }
            if (value === 'true') {
              value = true
            }
          }
        }
        if (flagType !== 'any' && value && flagType !== typeof value) {
          valid = { status: false, flag: item, message: `${item} expected ${flagType}, ${typeof value} supplied` }
        }
      })
    }

    return valid
  }

  setDefaultFlags(cli, flags) {
    if (!flags) {
      return {}
    }
    let keys = Object.keys(flags)

    let defaults = {}
    keys.map((flag) => {
      let alias = ''
      if (flags[flag]?.hasOwnProperty('aliases')) {
        alias = flags[flag].aliases[0]
      }
      let defaultValue = this.toolbox.utils.dot.get(flags[flag].default)
      if (defaultValue === undefined) {
        defaultValue = null
        if (flag.type === 'boolean') {
          defaultValue = false
        }
      }
      defaults = Object.assign(defaults, {
        [flag]: this.toolbox.utils.dot.get(
          cli.arguments[flag] || this.toolbox.utils.dot.get(cli.arguments[alias] || defaultValue)
        ),
        [alias]: this.toolbox.utils.dot.get(
          cli.arguments[alias] || this.toolbox.utils.dot.get(cli.arguments[flag] || defaultValue)
        ),
      })
    })

    return defaults
  }

  argumentHasOption(args, needles) {
    if (typeof args === 'undefined') {
      this.print.error('Invalid Arguments')
      return false
    }

    if (typeof needles === 'undefined') {
      this.print.error('Invalid Option Value')
      return false
    }

    let items = typeof needles === 'string' ? needles.split(',') : needles

    for (let i = 0; i < items.length; i++) {
      if (items[i] === undefined) {
        return false
      }
      if (args.hasOwnProperty(items[i])) {
        return true
      }
    }
    return false
  }

  getOptionValue(args, optName, defaultValue = null) {
    if (this.argumentHasOption(args, optName)) {
      let options = typeof optName === 'string' ? [optName] : optName
      for (let i = 0; i < options.length; i++) {
        let option = options[i]
        if (args.hasOwnProperty(option)) {
          return args[option]
        }
      }
      return defaultValue
    }
    return defaultValue
  }

  /**
   * CLI Interface Commands
   */
  showCommands() {
    this.fs.mkdirSync(this.app.getCommandPath(), { recursive: true })

    let commandFiles = this.filesystem.directoryList(this.app.getCommandPath(), { filesOnly: true })

    let commands = ''
    let projectHome = tildify(this.app.getCommandPath())

    if (commandFiles.length === 0) {
      commands += this.toolbox.colors.red('  There are no defined commands\n')
      commands += this.toolbox.colors.red(`  Please review your ${projectHome} directory\n`)
    }

    commandFiles.forEach((filename) => {
      let module = require(filename)
      let disabled = module.disabled || false
      let hidden = module.hidden || false

      if (!disabled && !hidden) {
        let name = module.name || ''
        if (module?.flags) {
          if (Object.keys(module.flags).length > 0) {
            name += ' [args]'
          }
        }

        let description = module?.description || `${module.name} command`

        if (name.length > 0) {
          commands += '  ' + name.padEnd(HELP_PAD) + description + '\n'
        }
      }
    })

    return commands
  }

  showDebugCommand(command) {
    if (this.debug) {
      let separator = '='.repeat(this.toolbox.utils.windowSize().width)
      if (command !== undefined && command !== '') {
        let subCommand = this.toolbox.commandName.length > 0 ? this.toolbox.commandName : 'n/a'
        console.log('\n')
        let msg =
          ' 🚦  DEBUG COMMAND: \n' +
          `     command name:     ${command}\n` +
          `     subcommand name:  ${subCommand}\n` +
          '     options / flags:  ' +
          JSON.stringify(this.arguments).replace(/,/gi, ', ').replace(/:/gi, ': ')

        console.log(this.toolbox.colors.gray(separator))
        this.toolbox.print.debug(msg)
        console.log(this.toolbox.colors.gray(separator))

        process.exit(0)
      }
    }
  }

  showVersion(options = { simple: false }) {
    if (this.versionStr.length > 0) {
      console.log(this.versionStr)
    } else {
      let versionStr = this.pkgInfo.version
      let buildStr = this.pkgInfo.build

      const name = this.packageName.length > 0 ? this.packageName : this.toolbox.strings.titleCase(this.name)
      if (!options.simple) {
        console.log('') // give some breathing room when show --help
      }
      console.log(
        `🚧 ${this.toolbox.colors.blue.bold(name)} ${this.toolbox.colors.blue('v' + versionStr + ` (${buildStr})`)}`
      )
      if (!options.simple) {
        if (this.pkgInfo?.info) {
          let msg = colors.keyword('pink').dim.italic(this.pkgInfo.info)
          console.log(`   ${msg}`)
        } else {
          if (this.contributors.length > 0) {
            let info = this.contributors[0]
            console.log(
              `   ${this.toolbox.colors.green.italic('Crafted with love by ' + info.name + ' (' + info?.url + ')')}`
            )
          }
        }
      }
      console.log()
    }
  }

  showHelp(appName = '') {
    // if we have defined custom help, display it
    if (this.helpInfo.length > 0) {
      return this.toolbox.print.log(this.helpInfo)
    }

    // otherwise build CLI help
    if (this.command.length === 0) {
      this.showVersion()

      if (this.usageInfo.length > 0) {
        console.log(colors.yellow('Usage:'))
        console.log(this.formatInfo(this.usageInfo) + '\n')
      }

      console.log(colors.yellow('Commands:'))

      if (this.commandInfo.length > 0) {
        console.log(this.commandInfo + '\n')
      } else {
        let commands = this.showCommands()

        if (commands.length > 0) {
          console.log(commands)
        } else {
          console.log('  No Command Available\n')
        }
      }

      if (this.optionInfo.length > 1) {
        console.log(colors.yellow('Global Options:'))
        console.log(this.optionInfo + '\n')
      }

      if (this.exampleInfo.length > 0) {
        console.log(colors.yellow('Examples:'))
        console.log(this.formatInfo(this.exampleInfo) + '\n')
      }
    } else {
      this.showCommandHelp(this.command)
      this.showCommandHelpExample(this.command)
    }
  }

  validateCommand(command) {
    if (!this.isValidCommand(command) && this.hookData.hasOwnProperty('commandPrefix')) {
      // command not found, try adding commandPrefix
      if (!command.includes(this.hookData?.commandPrefix)) {
        let adjustedCommand = this.hookData.commandPrefix + command
        if (this.isValidCommand(adjustedCommand)) {
          command = adjustedCommand
        }
        Messenger.write('info', `added commandPrefix ${command}`)
      }
    }
    return command
  }

  showCommandHelp(command = '') {
    command = this.validateCommand(command)

    if (this.commandInfo.length > 0) {
      return this.commandInfo
    }

    let module = this.loadModuleByCommand(command)

    if (!this.toolbox.utils.has(module, 'name')) {
      let commandFilename = strings.titleCase(strings.camelCase(command)) + '.js'
      let message = `Unable to locate valid command file matching ${command}`

      console.log(this.toolbox.colors.red(`\n🚫  ${message}\n`))
      this.toolbox.print.note(`Make sure command such as ${commandFilename} exits\n`, 'TIP')

      process.exit(1)
    }

    if (module.disabled) {
      console.log('')
      this.toolbox.print.error(`Invalid Command "${command}"`, 'ERROR')
      let projectName = this.pkgInfo?.packageName || this.pkgInfo.name
      this.toolbox.print.warn(`        For list of available commands, execute '${projectName} --help'\n`)
      process.exit(1)
    }

    console.log(
      `\n🚧 ${this.toolbox.colors.blue.bold(this.pkgInfo.packageName)} ${this.toolbox.colors.blue(
        'v' + this.pkgInfo.version + `(${this.pkgInfo.build})`
      )}`
    )

    console.log('')
    console.log(this.toolbox.colors.cyan(`🛠  ${module.name}`))

    // show module description, or built description if property does not exist
    let description = this.toolbox.utils.has(module, 'description') ? module.description : `${module.name} command`
    console.log(`   ${description}`)

    if (module?.usage) {
      console.log(colors.yellow('\nUsage:'))
      console.log('  ' + module.usage)
    }

    if (this.toolbox.utils.has(module, 'arguments')) {
      console.log(colors.yellow('\nArguments:'))
      for (const [key, value] of Object.entries(module.arguments)) {
        let required = value?.required ? this.toolbox.colors.red.bold(REQUIRED_MARK) : ' '
        let hint = this.toolbox.utils.dot.get(module, `arguments.${key}.help`) || ''
        if (hint.length === 0) {
          hint = this.toolbox.utils.dot.get(module, `arguments.${key}.prompt.hint`)
        }
        // let hint = this.toolbox.utils.dot.get(module, `arguments.${key}.prompt.hint`)
        hint = hint?.length > 0 ? '(' + hint + ')' : ''

        console.log(`  ${key}                    ${required} ${value.description} ${colors.gray(hint)}`)
      }
    }

    console.log('')
    if (!module?.flags) {
      process.exit(0)
    }
    let keys = Object.keys(module.flags)

    let COL_WIDTH = 20
    keys.forEach((key) => {
      if (key.length >= COL_WIDTH) {
        COL_WIDTH = key.length + 5
      }
    })

    if (keys.length > 0) {
      let flags = keys.filter((item) => {
        return !module.flags['name']?.hidden
      })
      if (flags.length > 0) {
        console.log(this.toolbox.colors.yellow('Options:'))
        keys.forEach((flag) => {
          if (module.flags[flag]?.hidden) {
            return false
          }

          let description = module.flags[flag]['description'] || colors.yellow('<missing description>')
          let help = module.flags[flag]?.help ? module.flags[flag].help : ''
          // let hint = this.toolbox.utils.dot.get(module.flags[flag], 'prompt.hint') || ''
          // changed from hint to help 2021-08-30
          help = help.length > 0 ? '(' + help + ')' : ''
          if (help.length > 0) {
            description += colors.gray(` ${help}`)
          }
          let defaultValue = ''
          if (module.flags[flag]?.default) {
            defaultValue = this.toolbox.colors.cyan('[default: ' + module.flags[flag].default + ']')
            defaultValue = defaultValue.replace(/,/gi, ', ')
          }

          let required = ' '
          if (module.flags[flag]?.required) {
            required = this.toolbox.colors.red.bold(REQUIRED_MARK) // this.toolbox.colors.red('-required-')
          }

          let aliases = ''
          if (module.flags[flag]?.aliases && module.flags[flag].aliases.length > 0) {
            aliases = ', ' + '-' + module.flags[flag].aliases
          }

          let flags = '  --' + flag + aliases
          // pad 7 to include flag alias
          console.log(flags.padEnd(COL_WIDTH + 5), required, description, defaultValue)
        })

        console.log('')
        console.log(this.toolbox.colors.red('  ✖︎') + ' denotes required argument / options')
        console.log('')
      }
    }

    return `${module.name} help displayed`
  }

  showCommandHelpExample(command = '') {
    let module = this.loadModuleByCommand(command)
    if (!module.disabled) {
      if (module?.examples) {
        console.log(this.toolbox.colors.yellow('Examples:'))
        module.examples.forEach((example) => {
          console.log('  ' + this.appName + ' ' + example)
        })
        console.log('')
      }
    }
  }

  executeHook(hook = '', command = '', args = []) {
    if (this.hookData.hasOwnProperty(hook)) {
      this.hookData[hook](this.toolbox, command, args)
    }
  }

  async executeCommand(command, args) {
    let output = ''
    command = this.validateCommand(command)
    this.executeHook('beforeExecute', command, args)

    if (command.length > 0) {
      if (!this.isValidCommand(command)) {
        this.toolbox.print.error(`Invalid Command "${command}"`, 'ERROR')
        this.toolbox.print.note(`   For list of available commands, execute '${this.packageName} --help'\n`)
        process.exit(1)
      }

      let module = this.loadModuleByCommand(command)
      let disabled = module.disabled || false

      let argName = module?.arguments ? Object.keys(module.arguments)[0] : null
      let required = module?.arguments ? module.arguments[argName]?.required : false
      let prompt = module?.arguments ? module.arguments[argName]?.prompt && module.usePrompts : false

      if (this.argv.length <= 3 && module?.arguments && argName && required && !prompt) {
        console.log('')

        if (module.arguments[argName]?.help) {
          this.toolbox.print.error(module.arguments[argName].help, 'ERROR')
        } else {
          this.toolbox.print.error('"' + module.arguments[argName].description + '"' + ' Required', 'ERROR')
          this.toolbox.print.warn(colors.dim('        ' + strings.raw(module.usage)))
        }
        process.exit(0)
      } else {
        if (prompt && !disabled) {
          let argName = module?.arguments ? Object.keys(module.arguments)[0] : ''
          let answers = await prompts.run(this, module)

          this.toolbox.arguments = { ...answers, ...this.toolbox.arguments }
          this.toolbox.arguments[argName] = this.commandName || answers[argName] || answers.commandName
        }
      }

      if (!disabled) {
        let requiredArguments = this.hasRequiredArguments(module, this.toolbox.arguments)
        if (module?.arguments) {
          let argName = Object.keys(module.arguments)[0]
          if (module.arguments[argName]?.required && this.commandName.length === 0) {
            requiredArguments.unshift(module.arguments[argName].description)
          }
        }

        if (requiredArguments.length > 0 && !prompt) {
          output = '        - ' + requiredArguments.join(', ') + '\n'
          console.log('')
          this.toolbox.print.error('Missing Required Arguments:', 'ERROR')
          this.toolbox.print.error(output)
          this.executeHook('afterExecute', command, args, output)
          return output
        }

        if (module?.execute && !disabled) {
          let validator = this.validateArguments(this.arguments, module.flags)
          if (!validator.status) {
            console.log('')
            print.error(validator.message, 'ERROR')
            print.info('        Review command help for details on arguments and flags')
            process.exit()
          }

          this.arguments = this.setDefaultFlags(this, module.flags)

          if (module.hasOwnProperty('arguments')) {
            let keys = Object.keys(module.arguments)
            this.toolbox[keys[0]] = this.commandName
          }

          let result = module.execute(this.toolbox)
          this.executeHook('afterExecute', command, args, result)
        }
      } else {
        console.log('')
        let output = `Invalid Command "${command}"`
        this.toolbox.print.error(output, 'ERROR')
        let packageName = this.pkgInfo?.packageName ? this.pkgInfo.packageName : this.pkgInfo.name
        this.toolbox.print.warn(`        For list of available commands, execute '${packageName} --help'`)
      }

      return output
    }
  }

  handleCommand(argv, commandInfo = {}) {
    this.logToFile(argv, commandInfo.args || this.arguments)
    // special handle if default supplied in .run()
    commandInfo = argv.length >= 3 ? {} : commandInfo
    let command = commandInfo.name || this.command
    let args = commandInfo.args || this.arguments

    // if command not supplied, show help regardless
    if (command === '<command>') {
      command = ''
      this.command = ''
    }

    if (this.argumentHasOption(args, ['V', 'version'])) {
      console.log('')
      this.showVersion({ simple: true })
      process.exit(0)
    }

    this.debug ? this.showDebugCommand(command) : null

    if (this.command.length > 0 && this.arguments.help) {
      this.showCommandHelp(this.command)
      this.showCommandHelpExample(this.command)
      return
    }

    // if no command or --help supplied, use default command if it exists
    if (commandInfo?.default) {
      let defaultCommand = this.toolbox.strings.camelCase(commandInfo.default.replace('.js', ''))
      if (this.fs.exists(path.resolve(this.app.getCommandPath(), defaultCommand + '.js'))) {
        command = commandInfo.default
      }
    } else {
      if (command.length === 0 && !this.help) {
        let defaultCommand = path.resolve(this.app.getCommandPath(), 'default.js')
        if (this.fs.existsSync(defaultCommand)) {
          let module = require(defaultCommand)
          command = !module.disabled ? 'default' : command
        }
      }
    }

    return command.length > 0 ? this.executeCommand(command, args) : this.showHelp(this.appName)
  }

  loadExtensions(cli) {
    let extensionPath = this.app.getExtensionPath()
    if (!this.fs.existsSync(extensionPath)) {
      this.fs.mkdirSync(extensionPath)
    }
    let extensionFiles = this.fs.readdirSync(extensionPath)

    extensionFiles.forEach((filename) => {
      let extFilename = path.join(extensionPath, filename)
      let module = require(extFilename)(cli)
    })
  }

  logToFile(argv = [], args = {}) {
    let command = argv[2] || ''
    let resource = argv[3] || ''
    if (resource.length === 0) {
      return
    }

    let cmd = ''
    Object.keys(args).forEach((item) => {
      if (item !== 'anonymous' && item !== 'sub' && item !== 'log' && item.length > 1) {
        cmd += typeof args[item] === 'boolean' ? '--' + item + ' ' : '--' + item + ' ' + args[item] + ' '
      }
    })
    cmd = `${command} ${resource} ${cmd}`.trim()
    Messenger.loggerDebug(cmd)
  }
}

module.exports = {
  CLI,
  utils,
}

// expose toolbox
module.exports.api = api
module.exports.arrays = arrays
module.exports.colors = colors
module.exports.config = config
module.exports.environment = environment
module.exports.filesystem = filesystem
module.exports.helpers = require('./toolbox/helpers')
module.exports.packageManager = packageManager
module.exports.print = print
module.exports.prompt = prompts
module.exports.strings = strings
module.exports.system = system
module.exports.table = table
module.exports.template = template
module.exports.utils = utils
module.exports.path = path
module.exports.shell = shell
module.exports.semver = semver
