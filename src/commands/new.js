/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const execa = require('execa')
const colors = require('chalk')
const process = require('process')
const { prompt } = require('enquirer')

const Ora = require('ora')

const buildQuestion = (type, name, message, alternateOptions = {}) => {
  return { type, name, message, ...alternateOptions }
}

const spinner = new Ora({
  discardStdin: false,
  color: 'blue',
  text: '',
})

module.exports = {
  name: 'new',
  description: 'Generate New Gunner CLI',
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
    this.spinner = spinner
    this.join = toolbox.path.join

    const gitUserLocal = require('git-user-local')
    const githubUsername = require('github-username')

    let info = await gitUserLocal()
    let ghUserName = await githubUsername(info.user.email)

    console.log('')

    let [githubFirstName, githubLastName] = info.user.name.split(' ')

    let fname = toolbox.config.get('fname') || githubFirstName
    let lname = toolbox.config.get('lname') || githubLastName
    let email = toolbox.config.get('email') || info.user.email
    let gitUserName = toolbox.config.get('gitUserName') || ghUserName
    let pkgMgr = toolbox.config.get('pkgMgr') || 'npm'

    let questions = []
    if (toolbox.commandName.length === 0) {
      questions.push(
        buildQuestion('input', 'name', 'Please supply project name?', {
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
    questions.push(buildQuestion('input', 'fname', 'What is your first name?', { initial: fname }))
    questions.push(buildQuestion('input', 'lname', 'What is your last name?', { initial: lname }))
    questions.push(buildQuestion('input', 'email', 'What is your email?', { initial: email }))
    questions.push(buildQuestion('input', 'gitUserName', 'What is your github username?', { initial: gitUserName }))

    altOptions = {
      choices: ['npm', 'yarn'],
      maxSelected: 1,
      limit: 2,
      hint: 'Make sure you dont mix tools',
      initial: pkgMgr,
    }

    questions.push(buildQuestion('select', 'pkgMgr', 'What package manager would you like to use?', altOptions))
    questions.push(buildQuestion('confirm', 'usePrettier', 'Would you like to use Prettier?'))
    questions.push(buildQuestion('confirm', 'useEslint', 'Would you like to use ESLint?'))

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
          toolbox.print.success('✔ Answers Saved...')
          Object.keys(answers).forEach((key) => {
            if (key !== 'name' && key !== 'usePrettier') {
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
    answers = { fname: '', lname: '', email: '', git: '', pkgMgr: 'npm', usePrettier: false, useEslint: false }
  ) {
    this.src = this.join(toolbox.env.projectRoot, 'src')
    this.dest = this.join(toolbox.app.getProjectPath(), toolbox.commandName)
    this.answers = { ...answers }

    console.log('')

    if (toolbox.env.overwrite) {
      toolbox.filesystem.rmdir(this.dest)
    }

    if (toolbox.filesystem.existsSync(this.dest)) {
      console.log()
      toolbox.print.error(`./${toolbox.path.basename(this.dest)} already exists`, 'ERROR')
      console.log('')
      process.exit(0)
    }

    // setup
    setTimeout(() => {
      this.setup(toolbox)
    }, 500)

    // initialize project
    setTimeout(() => {
      this.initializeProject(toolbox)
    }, 2000)

    // prepare source files
    setTimeout(() => {
      this.prepareSourceFiles(toolbox)
    }, 3000)

    // create project files
    setTimeout(() => {
      this.createProjectFiles(toolbox)
    }, 4000)

    // install dependencies
    setTimeout(() => {
      this.installDependencies(toolbox)
    }, 5000)
  },

  setup: async function (toolbox) {
    this.spinner.start()
    this.spinner.text = toolbox.colors.blue(`Preparing '${toolbox.commandName}' Project...`)
    return true
  },

  initializeProject: async function (toolbox) {
    spinner.color = 'blue'
    spinner.text = toolbox.colors.blue('Initializing Project...')
    toolbox.filesystem.mkdirSync(toolbox.commandName)
    spinner.text = toolbox.colors.green(`'${toolbox.commandName}' Project Initialized...`)
    spinner.succeed()
    return true
  },

  prepareSourceFiles: async function (toolbox) {
    this.spinner.color = 'blue'
    this.spinner.text = toolbox.colors.blue('Preparing Source Files...')
    this.spinner.start()

    toolbox.filesystem.copy(this.src, this.join(this.dest, 'src'))
    toolbox.filesystem.copy(this.join(toolbox.env.projectRoot, 'bin'), this.join(this.dest, 'bin'))
    toolbox.filesystem.copy(
      this.join(toolbox.env.projectRoot, 'tasks', 'bumpBuild.js'),
      this.join(this.dest, 'tasks', 'bumpBuild.js')
    )

    toolbox.filesystem.delete(this.join(this.dest, 'src', 'commands', 'new.js'))
    toolbox.filesystem.delete(this.join(this.dest, 'src', 'templates', 'package.json.mustache'))
    toolbox.filesystem.delete(this.join(this.dest, 'src', 'templates', 'LICENSE.mustache'))
    toolbox.filesystem.delete(this.join(this.dest, 'src', 'templates', 'README.md.mustache'))
    toolbox.filesystem.delete(this.join(this.dest, 'src', 'templates', 'app.test.mustache'))
    toolbox.filesystem.delete(this.join(this.dest, 'src', 'toolbox', '_deprecated_'))
    toolbox.filesystem.delete(this.join(this.dest, 'src', 'unused'))
    toolbox.filesystem.delete(this.join(this.dest, 'src', 'utils'))

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

      toolbox.filesystem.copy(
        this.join(toolbox.env.projectRoot, 'tasks', 'lint.js'),
        this.join(this.dest, 'tasks', 'lint.js')
      )

      toolbox.template.mergeFile(
        '.eslintrc.js.mustache',
        this.join(this.dest, '.eslintrc.js'),
        { eslintExtends, eslintPlugins, useEslint: this.answers.useEslint, usePrettier: this.answers.usePrettier },
        { overwrite: true }
      )
    }

    toolbox.filesystem.copy(this.join(toolbox.env.projectRoot, 'index.js'), this.join(this.dest, 'index.js'))
    this.spinner.text = toolbox.colors.green(`'${toolbox.commandName}' Source Files Created...`)
    this.spinner.succeed()

    return true
  },

  createProjectFiles: async function (toolbox) {
    this.spinner.color = 'blue'
    this.spinner.text = toolbox.colors.blue('Creating Project Files...')
    this.spinner.indent = 2
    this.spinner.start()
    let pkgFilename = this.join(this.dest, 'package.json')

    let options = ''
    if (this.answers.usePrettier) {
      options = '"prettier": ">=2",'
    }
    if (this.answers.useEslint) {
      options += '\n    "babel-eslint": ">=5",'
      options += '\n    "eslint": ">=7",'
      if (this.answers.usePrettier) {
        options += '\n    "eslint-config-prettier": ">=7",'
        options += '\n    "eslint-plugin-prettier": ">=3",'
      }
    }

    // trim trailing comma
    options = options.replace(/(^,)|(,$)/g, '')

    let github = this.answers.gitUserName.length > 0 ? `(https://github.com/${this.answers.gitUserName})` : ''
    let repo = github.length > 0 ? `https://github.com/${this.answers.gitUserName}}/${toolbox.commandName}` : ''
    toolbox.template.mergeFile(
      'package.json.mustache',
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
        useEslint: this.answers.useEslint,
        usePrettier: this.answers.usePrettier,
      },
      { overwrite: true }
    )

    toolbox.template.mergeFile('LICENSE.mustache', this.join(this.dest, 'LICENSE'), {
      fname: this.answers.fname,
      lname: this.answers.lname,
      year: new Date().getFullYear(),
    })

    toolbox.template.mergeFile('README.md.mustache', this.join(this.dest, 'README.md'), {
      name: toolbox.commandName,
      fname: this.answers.fname,
      lname: this.answers.lname,
      gitUserName: this.answers.git,
      year: new Date().getFullYear(),
      email: this.answers.email,
    })

    this.spinner.indent = 0
    this.spinner.text = toolbox.colors.green(`'${toolbox.commandName}' Project Files Created...`)
    this.spinner.succeed()

    return true
  },

  installDependencies: async function (toolbox) {
    this.spinner.start()
    this.spinner.color = 'yellow'
    this.spinner.indent = 2
    this.spinner.text = toolbox.colors.yellow(`Installing Depedencies (using ${this.answers.pkgMgr})...`)
    toolbox.filesystem.chdir(this.dest)

    execa(this.answers.pkgMgr, this.answers.pkgMgr === 'npm' ? ['install'] : [])
      .then((result) => {
        this.spinner.color = 'green'
        this.spinner.indent = 0
        this.spinner.text = toolbox.colors.green('Installation Complete...')
        this.spinner.succeed()
        setTimeout(() => {
          console.log('')
          toolbox.print.success(`${toolbox.commandName} Project Created Successfully`, 'SUCCESS')
          toolbox.print.notice('\nNext Steps:\n')
          toolbox.print.notice(`  > cd ${toolbox.commandName}`)
          toolbox.print.notice(`  > ${this.answers.pkgMgr} link ${toolbox.commandName}`)
          toolbox.print.notice(`  > ${toolbox.commandName} --help`)
          console.log('')
        }, 1000)
      })
      .catch((err) => {
        this.spinner.fail('An error occured installing depdencies')
        toolbox.print.error(err)
      })

    return true
  },
}
