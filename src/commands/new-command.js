/*-------------------------------------------------------------------------------------------
 * Copyright (c) Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

/*
 - create commands directory
  - create sample command (hello-world.js)
 - initialize package.json
 - create ./index.js
 - create config file (.myapprc.json or myapp.config.js)

*/

const execa = require('execa')
const colors = require('chalk')
const process = require('process')
const { execSync } = require('child_process')
const { prompt } = require('enquirer')

const Ora = require('ora')

const spinner = new Ora({
  discardStdin: false,
  color: 'blue',
  text: colors.blue('Preparing Project...'),
})

module.exports = {
  name: 'new',
  description: 'Generate New Gunner CLI',
  usage: 'new name <command> <flags>',
  flags: {
    description: { aliases: ['d'], description: 'Command description', required: false },
  },
  async execute(toolbox) {
    const buildQuestion = (type, name, message, alternateOptions = {}) => {
      return { type, name, message, ...alternateOptions }
    }

    let fname = toolbox.config.get('fname')
    let lname = toolbox.config.get('lname')
    let email = toolbox.config.get('email')
    let gitUserName = toolbox.config.get('gitUserName')
    let pkgMgr = toolbox.config.get('pkgMgr')

    let questions = []
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

    prompt(questions)
      .then(async (answers) => {
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
            Object.keys(answers).forEach((key) => toolbox.config.set(key, answers[key]))
          }
        }

        this.generate(toolbox, answers.fname, answers.lname, answers.email, answers.gitUserName, answers.pkgMgr)
      })
      .catch((err) => {
        console.log('')

        if (err) {
          console.error(err)
          console.log('')
          toolbox.print.error('CLI Creation Aborted', 'ERROR')
          console.log()
        } else {
          toolbox.print.warn('CLI creation cancelled', 'CANCELLED')
          console.log('')
        }
      })
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
      toolbox.filesystem.delete(join(dest, 'src', 'commands', 'new-command.js'))
      toolbox.filesystem.delete(join(dest, 'src', 'templates', 'package.json.mustache'))
      toolbox.filesystem.delete(join(dest, 'src', 'toolbox', '_deprecated_'))

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
      let result = toolbox.template.mergeFile(
        'package.json.mustache',
        pkgFilename,
        { name: toolbox.commandName, fname, lname, email, gituser: git, github, repo },
        { overwrite: true }
      )
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
            toolbox.print.notice('\nNext:\n')
            toolbox.print.notice(`  > cd ${toolbox.commandName}`)
            toolbox.print.notice(`  > npm link ${toolbox.commandName}`)
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
