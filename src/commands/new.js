/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const execa = require('execa')
const colors = require('chalk')
const process = require('process')
const { prompt } = require('enquirer')
const pkgInfo = require('../../package.json')

const Ora = require('ora')
const { dd } = require('dumper.js')

const spinner = new Ora({
  discardStdin: false,
  color: 'blue',
  text: '',
})

module.exports = {
  name: 'new',
  description: 'Generate new CLI project',
  usage: `new ${colors.blue('[name]')} ${colors.magenta('<flags>')}            ${colors.blue.bold(
    '[name]'
  )} of new CLI`,
  flags: {
    overwrite: {
      aliases: ['o', 'w'],
      description: `Overwrite existing directory matching ${colors.blue.bold('[name]')}`,
      required: false,
    },
  },

  async execute(toolbox) {
    this.dest = toolbox.path.join(toolbox.app.getProjectPath(), toolbox.commandName)
    if (toolbox.filesystem.existsSync(this.dest) && !toolbox.arguments.overwrite) {
      toolbox.print.error(`\nThere's already a directory named "${toolbox.commandName}"`)
      let result = await toolbox.prompts.confirm('Would you like to overwrite it?', { initial: false })
      if (result.answer) {
        toolbox.env.overwrite = true
      } else {
        console.log('')
        toolbox.print.warning('CLI Creation Aborted\n', 'ABORT')
        return
      }
    }

    this.spinner = spinner
    this.join = toolbox.path.join

    const gitUserLocal = require('git-user-local')
    const githubUsername = require('github-username')

    let ghUserLocal = await gitUserLocal()
    let ghUserName = await githubUsername(ghUserLocal.user.email)

    console.log('')

    let [githubFirstName, githubLastName] = ghUserLocal.user.name.split(' ')

    let fname = toolbox.config.get('fname') || githubFirstName
    let lname = toolbox.config.get('lname') || githubLastName
    let email = toolbox.config.get('email') || ghUserLocal.user.email
    let gitUserName = toolbox.config.get('gitUserName') || ghUserName
    let pkgMgr = toolbox.config.get('pkgMgr') || 'npm'

    let questions = []
    if (toolbox.commandName.length === 0) {
      questions.push(
        toolbox.prompts.buildQuestion('input', 'name', 'Please supply project name?', {
          validate: (value, state, item, index) => {
            if (value.length > 0) {
              const newProject = this.join(toolbox.app.getProjectPath(), value)
              if (toolbox.filesystem.exists(newProject)) {
                return toolbox.colors.red(toolbox.utils.tildify(newProject) + ' already exists')
              }
            } else {
              return toolbox.colors.red('project name must be at least one character')
            }
            return true
          },
        })
      )
    }
    questions.push(toolbox.prompts.buildQuestion('input', 'fname', 'What is your first name?', { initial: fname }))
    questions.push(toolbox.prompts.buildQuestion('input', 'lname', 'What is your last name?', { initial: lname }))
    questions.push(toolbox.prompts.buildQuestion('input', 'email', 'What is your email?', { initial: email }))
    questions.push(
      toolbox.prompts.buildQuestion('input', 'gitUserName', 'What is your github username?', { initial: gitUserName })
    )

    let altOptions = {
      choices: ['npm', 'yarn'],
      maxSelected: 1,
      limit: 2,
      hint: 'Make sure you dont mix tools',
      initial: pkgMgr,
      result: (value) => {
        console.log('')
        return value
      },
    }

    let spaceOptions = {
      result: (value) => {
        console.log('')
        return value
      },
    }

    questions.push(
      toolbox.prompts.buildQuestion('select', 'pkgMgr', 'What package manager would you like to use?', altOptions)
    )
    questions.push(toolbox.prompts.buildQuestion('confirm', 'usePrettier', 'Would you like to use Prettier?'))
    questions.push(toolbox.prompts.buildQuestion('confirm', 'useEslint', 'Would you like to use ESLint?'))
    questions.push(
      toolbox.prompts.buildQuestion(
        'confirm',
        'useTodo',
        'Would you like to integrate Todo File Generator (uses leasot)?'
      )
    )

    let testOptions = {
      choices: ['jest', 'mocha', 'none'],
      maxSelected: 1,
      limit: 3,
      initial: 'jest',
      result: (value) => {
        console.log('')
        return value
      },
    }

    questions.push(
      toolbox.prompts.buildQuestion('select', 'testTool', 'Which testing framework would you like to use?', testOptions)
    )

    let answers = await toolbox.prompts.show(questions)

    if (answers === false) {
      console.log('')
      toolbox.print.warning('CLI Creation Aborted', 'ABORT')
      console.log()
    } else {
      // if we have changed any answer, prompt to save changes
      if (
        fname !== answers.fname ||
        lname !== answers.lname ||
        email !== answers.email ||
        gitUserName !== answers.gitUserName ||
        pkgMgr !== answers.pkgMgr
      ) {
        console.log('\n')
        const { Confirm } = require('enquirer')
        const savePrompt = new Confirm({ name: 'save', message: 'Would you like to save answers for future use?' })
        if (await savePrompt.run()) {
          toolbox.print.success('✔ Answers Saved')
          Object.keys(answers).forEach((key) => {
            if (key === 'fname' || key === 'lname' || key === 'email' || key === 'gitUserName' || key === 'pkgMgr') {
              toolbox.config.set(key, answers[key])
            }
          })
        }
      }

      // create new cli config file
      let configFilename = toolbox.config.configFilename()
      let newConfigFilename = configFilename.replace('gunner', toolbox.commandName)

      // if we dont already have a local config file, create
      if (!toolbox.filesystem.exists(configFilename)) {
        toolbox.filesystem.write(configFilename, JSON.stringify(answers))
      }

      toolbox.filesystem.write(newConfigFilename, JSON.stringify(answers))

      if (toolbox.commandName.length === 0) {
        toolbox.commandName = answers.name
      }

      this.generate(toolbox, answers)
    }
  },

  async generate(
    toolbox,
    answers = {
      fname: '',
      lname: '',
      email: '',
      git: '',
      pkgMgr: 'npm',
      usePrettier: false,
      useEslint: false,
      useTodo: false,
      testTool: 'none',
    }
  ) {
    this.src = this.join(toolbox.env.projectRoot, 'src')
    this.dest = this.join(toolbox.app.getProjectPath(), toolbox.commandName)
    this.answers = { ...answers }

    this.srcTasksPath = this.join(toolbox.env.projectRoot, 'tasks')
    this.destTasksPath = this.join(this.dest, 'tasks')

    if (toolbox.env.overwrite) {
      toolbox.filesystem.rmdir(this.dest)
    }

    // setup
    setTimeout(() => {
      this.setup(toolbox)
    }, 500)

    // initialize project
    setTimeout(() => {
      this.initializeProject(toolbox)
    }, 2000)

    // initialize git
    setTimeout(() => {
      this.initializeGit(toolbox)
    }, 3000)

    // prepare source files
    setTimeout(() => {
      this.prepareSourceFiles(toolbox)
    }, 4000)

    // create project files
    setTimeout(() => {
      this.createProjectFiles(toolbox)
    }, 5000)

    // install dependencies
    setTimeout(() => {
      this.installDependencies(toolbox)
    }, 6000)
  },

  setup: async function (toolbox) {
    this.spinner.start()
    this.spinner.text =
      toolbox.colors.blue(`✨ Preparing ${toolbox.colors.yellow(toolbox.commandName)} Project in `) +
      toolbox.colors.yellow(this.dest) +
      '...'
    return true
  },

  initializeProject: async function (toolbox) {
    spinner.color = 'blue'
    spinner.text = toolbox.colors.blue('✨ Initializing Project')
    toolbox.filesystem.mkdirSync(toolbox.commandName)
    spinner.text = toolbox.colors.green('✨ Project Initialized in ') + toolbox.colors.yellow(this.dest)
    spinner.succeed()
    return true
  },

  initializeGit: async function (toolbox) {
    spinner.color = 'blue'
    spinner.text = toolbox.colors.blue('🗃  Initializing Git Repository')
    this.spinner.start()
    toolbox.filesystem.chdir(toolbox.commandName)
    toolbox.system.run('git init')
    toolbox.filesystem.chdir('..')

    toolbox.filesystem.copy(
      this.join(toolbox.env.projectRoot, 'src', 'templates', '.gitignore.mustache'),
      this.join(this.dest, '.gitignore')
    )

    spinner.text = toolbox.colors.green('🗃  Git Repository Initialized')

    spinner.succeed()
    return true
  },

  prepareSourceFiles: async function (toolbox) {
    this.spinner.color = 'blue'
    this.spinner.text = toolbox.colors.blue('📄 Preparing Source Files...')
    this.spinner.start()

    // toolbox.filesystem.copy(this.src, this.join(this.dest, 'src'))
    toolbox.filesystem.mkdirSync(this.join(this.dest, 'src'))
    toolbox.filesystem.mkdirSync(this.join(this.dest, 'src', 'commands'))
    toolbox.filesystem.mkdirSync(this.join(this.dest, 'src', 'extensions'))
    toolbox.filesystem.copy(
      this.join(this.src, 'commands', 'sayHello.js'),
      this.join(this.dest, 'src', 'commands', 'sayHello.js')
    )
    toolbox.filesystem.copy(this.join(toolbox.env.projectRoot, 'bin'), this.join(this.dest, 'bin'))
    toolbox.filesystem.renameSync(
      this.join(this.dest, 'bin', 'gunner'),
      this.join(this.dest, 'bin', toolbox.commandName)
    )
    toolbox.filesystem.copy(this.join(this.srcTasksPath, 'bumpBuild.js'), this.join(this.destTasksPath, 'bumpBuild.js'))
    toolbox.filesystem.executable(this.destTasksPath, 'bumpBuild.js')

    if (this.answers.testTool !== 'none') {
      if (this.answers.testTool === 'mocha') {
        toolbox.filesystem.copy(
          this.join(toolbox.env.projectRoot, 'src', 'templates', 'testCleanup.js.mustache'),
          this.join(this.dest, 'test', 'utils', 'testCleanup.js')
        )

        toolbox.filesystem.copy(
          this.join(toolbox.env.projectRoot, 'src', 'templates', 'test-mocha.js.mustache'),
          this.join(this.destTasksPath, 'test.js'),
          { overwrite: true }
        )
      }
    } else {
      toolbox.filesystem.copy(
        this.join(toolbox.env.projectRoot, 'src', 'templates', 'test.js.mustache'),
        this.join(this.destTasksPath, 'test.js')
      )
    }
    toolbox.filesystem.executable(this.destTasksPath, 'test.js')

    if (this.answers.usePrettier) {
      toolbox.filesystem.copy(
        this.join(toolbox.env.projectRoot, 'src', 'templates', 'prettier.config.js'),
        this.join(this.dest, 'prettier.config.js')
      )
    }

    if (this.answers.useEslint) {
      /*eslint-disable */
      let eslintExtends = 'eslint:recommended'
      if (this.answers.usePrettier) {
        eslintExtends = "'prettier'"
      }

      let eslintPlugins = ''
      if (this.answers.usePrettier) {
        eslintPlugins = "'prettier'"
      }
      /*eslint-enable */

      toolbox.filesystem.copy(this.join(this.srcTasksPath, 'lint.js'), this.join(this.destTasksPath, 'lint.js'))
      toolbox.filesystem.executable(this.destTasksPath, 'lint.js')

      toolbox.template.mergeFile(
        this.join(this.src, 'templates', '.eslintrc.js.mustache'),
        this.join(this.dest, '.eslintrc.js'),
        { eslintExtends, eslintPlugins, useEslint: this.answers.useEslint, usePrettier: this.answers.usePrettier },
        { overwrite: true }
      )
    }

    if (this.answers.useTodo) {
      toolbox.filesystem.copy(this.join(this.srcTasksPath, 'todo.js'), this.join(this.destTasksPath, 'todo.js'))
      toolbox.filesystem.executable(this.destTasksPath, 'todo.js')
    }

    toolbox.filesystem.copy(
      this.join(toolbox.env.projectRoot, 'src', 'templates', 'index.js.mustache'),
      this.join(this.dest, 'index.js')
    )
    this.spinner.text = toolbox.colors.green('📄 Source Files Created')
    this.spinner.succeed()

    return true
  },

  createProjectFiles: async function (toolbox) {
    this.spinner.color = 'blue'
    this.spinner.text = toolbox.colors.blue('📦 Creating Project Files...')
    this.spinner.indent = 2
    this.spinner.start()
    let pkgFilename = this.join(this.dest, 'package.json')

    let scriptItems = [{ bump: 'node ./tasks/bumpBuild.js' }]

    let devDependencies = []

    if (this.answers.usePrettier) {
      devDependencies.push({ prettier: '>=2' })
    }

    if (this.answers.useEslint) {
      devDependencies.push({ 'babel-eslint': '>=5', eslint: '>=7' })
      if (this.answers.usePrettier) {
        devDependencies.push({ 'eslint-config-prettier': '>=7', 'eslint-plugin-prettier': '>=3' })
      }
      scriptItems.push({ lint: 'node ./tasks/lint.js' })
    }

    if (this.answers.useTodo) {
      devDependencies.push({ leasot: '>=11' })
      scriptItems.push({ todo: 'node ./tasks/todo.js' })
    }

    if (this.answers.testTool !== 'none') {
      // setup mocha tooling
      if (this.answers.testTool === 'mocha') {
        devDependencies.push({ chai: '>=4', mocha: '>=6', nyc: '>=15' })
        scriptItems.push({ test: 'node ./tasks/test.js' })
        scriptItems.push({ ['test:ci']: 'mocha --reporter dot && node ./test/utils/testCleanup.js' })
        scriptItems.push({ ['test:watch']: 'mocha ./test/*.test.js --growl --watch --reporter progress' })
        scriptItems.push({ ['test:coverage']: 'nyc mocha ./test/*.test.js && node ./test/utils/testCleanup.js' })

        toolbox.template.mergeFile(
          this.join(this.src, 'templates', 'mocha', 'cli-integration.test.js.mustache'),
          this.join(this.dest, 'test', 'cli-integration.test.js'),
          {
            name: toolbox.commandName,
          }
        )
      }

      // setup jest tooling
      if (this.answers.testTool === 'jest') {
        devDependencies.push({ jest: '>=24' })
        scriptItems.push({ test: 'jest' })
        scriptItems.push({ ['test:watch']: 'jest --watch' })
        scriptItems.push({ ['test:snapshot']: 'jest --updateSnapshot' })
        scriptItems.push({ ['test:coverage']: 'jest --coverage' })

        toolbox.template.mergeFile(
          this.join(this.src, 'templates', 'jest', 'cli-integration.test.js.mustache'),
          this.join(this.dest, '__test__', 'cli-integration.test.js'),
          {
            name: toolbox.commandName,
          }
        )
      }

      if (this.answers.testTool === 'none') {
        scriptItems.push({ test: 'node ./tasks/test.js' })
      }
    }

    let scripts = ''
    scriptItems.forEach((item) => {
      Object.entries(item).forEach((entry) => {
        const [key, value] = entry
        scripts += `"${key}": "${value}",`
      })
    })

    let options = ''
    devDependencies.forEach((item) => {
      Object.entries(item).forEach((entry) => {
        const [key, value] = entry
        options += `"${key}": "${value}",`
      })
    })

    // trim trailing comma
    options = options.replace(/(^,)|(,$)/g, '')
    scripts = scripts.replace(/(^,)|(,$)/g, '')

    let github = this.answers.gitUserName.length > 0 ? `(https://github.com/${this.answers.gitUserName})` : ''
    let repo = github.length > 0 ? `https://github.com/${this.answers.gitUserName}/${toolbox.commandName}` : ''
    let pkgInfo = require('../../package.json')

    toolbox.template.mergeFile(
      this.join(this.src, 'templates', 'package.json.mustache'),
      pkgFilename,
      {
        name: toolbox.commandName,
        fname: this.answers.fname,
        lname: this.answers.lname,
        email: this.answers.email,
        gituser: this.answers.gitUserName,
        github,
        repo,
        options,
        scripts,
        useEslint: this.answers.useEslint,
        usePrettier: this.answers.usePrettier,
        useJest: this.answers.testTool === 'jest',
        gunnerVersion: pkgInfo.version,
      },
      { overwrite: true }
    )

    toolbox.template.mergeFile(this.join(this.src, 'templates', 'LICENSE.mustache'), this.join(this.dest, 'LICENSE'), {
      fname: this.answers.fname,
      lname: this.answers.lname,
      year: new Date().getFullYear(),
    })

    toolbox.template.mergeFile(
      this.join(this.src, 'templates', 'README.md.mustache'),
      this.join(this.dest, 'README.md'),
      {
        name: toolbox.commandName,
        fname: this.answers.fname,
        lname: this.answers.lname,
        gitUserName: this.answers.git,
        year: new Date().getFullYear(),
        email: this.answers.email,
      }
    )

    this.spinner.indent = 0
    this.spinner.text = toolbox.colors.green('📦 Project Files Created')
    this.spinner.succeed()

    return true
  },

  installDependencies: async function (toolbox) {
    this.spinner.start()
    this.spinner.color = 'yellow'
    this.spinner.indent = 0
    this.spinner.text = toolbox.colors.yellow(`⚙️  Installing Depedencies (using ${this.answers.pkgMgr})...`)
    toolbox.filesystem.chdir(this.dest)

    execa(this.answers.pkgMgr, this.answers.pkgMgr === 'npm' ? ['install'] : [])
      .then((result) => {
        this.spinner.color = 'green'
        this.spinner.indent = 0
        this.spinner.text = toolbox.colors.green('⚙️  Installation Complete')
        this.spinner.succeed()
        setTimeout(() => {
          console.log('')
          toolbox.print.success(`${toolbox.colors.yellow(toolbox.commandName)} Project Created Successfully`, 'SUCCESS')
          toolbox.print.notice('\n👉 Next Steps:\n')
          toolbox.print.notice(`   ${toolbox.colors.gray('$')} cd ${toolbox.commandName}`)
          toolbox.print.notice(`   ${toolbox.colors.gray('$')} ${this.answers.pkgMgr} link ${toolbox.commandName}`)
          toolbox.print.debug(colors.dim('     info => https://docs.npmjs.com/cli/v6/commands/npm-link'))
          toolbox.print.notice(`   ${toolbox.colors.gray('$')} ${toolbox.commandName} --help\n`)
          console.log(colors.keyword('pink').italic('   🐶 Woof!'))
          console.log(colors.keyword('pink').italic(`      ${pkgInfo.info.replace('   ', '      ')}\n`))
        }, 1000)
      })
      .catch((err) => {
        this.spinner.fail('An error occured installing depdencies')
        toolbox.print.error(err)
      })

    return true
  },
}
