/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const execa = require('execa')
const colors = require('chalk')
const process = require('process')
const { execSync } = require('child_process')
const { prompt } = require('enquirer')

const Ora = require('ora')
const { DefaultDeserializer } = require('v8')

const spinner = new Ora({
  discardStdin: false,
  color: 'blue',
  text: colors.blue('Preparing Project...'),
})

module.exports = {
  name: 'new',
  description: 'Generate New Gunner CLI',
  usage: `new ${colors.blue('[name]')} ${colors.magenta('<flags>')}            ${colors.blue.bold(
    '[name]'
  )} of new CLI`,
  flags: {
    overwrite: {
      aliases: ['o'],
      description: `Overwrite existing directory matching ${colors.blue.bold('[name]')}`,
      required: false,
    },
  },
  async execute(toolbox) {
    const gitUserLocal = require('git-user-local')
    const githubUsername = require('github-username')

    // if (toolbox.commandName.length === 0) {
    //   console.log('')
    //   toolbox.print.error('You must supply project name `gunner new <name>`', 'ERROR')
    //   console.log('')
    //   process.exit(0)
    // }
    // read github info
    let info = await gitUserLocal()
    let ghUserName = await githubUsername(info.user.email)

    console.log('')

    const buildQuestion = (type, name, message, alternateOptions = {}) => {
      return { type, name, message, ...alternateOptions }
    }

    let ghLocal = await gitUserLocal()
    let [githubFirstName, githubLastName] = ghLocal.user.name.split(' ')

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
              let dest = toolbox.path.join(toolbox.app.getProjectPath(), value)
              if (toolbox.filesystem.exists(dest)) {
                return toolbox.colors.red(toolbox.utils.tildify(dest) + ' already exists')
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
            if (key !== 'name') {
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
      this.generate(toolbox, answers.fname, answers.lname, answers.email, answers.gitUserName, answers.pkgMgr)
    }
  },

  generate(toolbox, fname = '', lname = '', email = '', git = '', pkgMgr = 'npm') {
    let join = toolbox.path.join
    console.log('')

    let dest = toolbox.path.join(toolbox.app.getProjectPath(), toolbox.commandName)

    if (toolbox.arguments.overwrite) {
      toolbox.filesystem.rmdir(dest)
    }

    if (toolbox.filesystem.existsSync(dest)) {
      console.log()
      toolbox.print.error(`./${toolbox.path.basename(dest)} already exists`, 'ERROR')
      console.log('')
      process.exit(0)
    }

    let src = toolbox.path.join(toolbox.env.projectRoot, 'src')

    setTimeout(() => {
      spinner.start()
      // spinner.spinner = 'bouncingBar'
    }, 500)

    setTimeout(() => {
      spinner.color = 'blue'
      spinner.text = toolbox.colors.blue('Initializing Project...')
      toolbox.filesystem.mkdirSync(toolbox.commandName)
      spinner.text = toolbox.colors.green('Project Initialized...')
      spinner.succeed()
    }, 2000)

    setTimeout(() => {
      spinner.color = 'blue'
      spinner.text = toolbox.colors.blue('Preparing Source Files...')
      spinner.start()

      toolbox.filesystem.copy(src, join(dest, 'src'))
      toolbox.filesystem.copy(join(toolbox.env.projectRoot, 'bin'), join(dest, 'bin'))
      toolbox.filesystem.copy(
        join(toolbox.env.projectRoot, 'tasks', 'bumpBuild.js'),
        join(dest, 'tasks', 'bumpBuild.js')
      )

      toolbox.filesystem.delete(join(dest, 'src', 'commands', 'new-command.js'))
      toolbox.filesystem.delete(join(dest, 'src', 'templates', 'package.json.mustache'))
      toolbox.filesystem.delete(join(dest, 'src', 'templates', 'LICENSE.mustache'))
      toolbox.filesystem.delete(join(dest, 'src', 'templates', 'README.md.mustache'))
      toolbox.filesystem.delete(join(dest, 'src', 'templates', 'app.test.mustache'))
      toolbox.filesystem.delete(join(dest, 'src', 'toolbox', '_deprecated_'))
      toolbox.filesystem.delete(join(dest, 'src', 'unused'))
      toolbox.filesystem.delete(join(dest, 'src', 'utils'))

      toolbox.filesystem.copy(join(toolbox.env.projectRoot, 'index.js'), join(dest, 'index.js'))
      spinner.text = toolbox.colors.green('Source Files Created...')
      spinner.succeed()
    }, 3000)

    setTimeout(() => {
      spinner.color = 'blue'
      spinner.text = toolbox.colors.blue('Creating Project Files...')
      spinner.indent = 2
      spinner.start()
      let pkgFilename = join(dest, 'package.json')

      let github = git.length > 0 ? `(https://github.com/${git})` : ''
      let repo = `https://github.com/${git}/${toolbox.commandName}`
      toolbox.template.mergeFile(
        'package.json.mustache',
        pkgFilename,
        { name: toolbox.commandName, fname, lname, email, gituser: git, github, repo },
        { overwrite: true }
      )

      toolbox.template.mergeFile('LICENSE.mustache', join(dest, 'LICENSE'), {
        fname,
        lname,
        year: new Date().getFullYear(),
      })

      toolbox.template.mergeFile('README.md.mustache', join(dest, 'README.md'), {
        name: toolbox.commandName,
        fname,
        lname,
        gitUserName: git,
        year: new Date().getFullYear(),
        email,
      })

      spinner.indent = 0
      spinner.text = toolbox.colors.green('Project Files Created...')
      spinner.succeed()
    }, 4000)

    setTimeout(() => {
      spinner.start()
      spinner.color = 'yellow'
      spinner.indent = 2
      spinner.text = toolbox.colors.yellow(`Installing Depedencies (using ${pkgMgr})...`)
      toolbox.filesystem.chdir(dest)
      execa(pkgMgr, pkgMgr === 'npm' ? ['install'] : [])
        .then((result) => {
          spinner.color = 'green'
          spinner.indent = 0
          spinner.text = toolbox.colors.green('Installation Complete...')
          spinner.succeed()
          setTimeout(() => {
            console.log('')
            toolbox.print.success(`${toolbox.commandName} Project Created Successfully`, 'SUCCESS')
            toolbox.print.notice('\nNext Steps:\n')
            toolbox.print.notice(`  > cd ${toolbox.commandName}`)
            toolbox.print.notice(`  > ${pkgMgr} link ${toolbox.commandName}`)
            toolbox.print.notice(`  > ${toolbox.commandName} --help`)
            console.log('')
          }, 1000)
        })
        .catch((err) => {
          spinner.fail('An error occured installing depdencies')
          toolbox.print.error(err)
        })
    }, 5000)
  },
}
