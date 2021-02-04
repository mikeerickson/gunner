/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const { prompt } = require('enquirer')
const chalk = require('chalk')

const buildQuestion = (type, name, message, alternateOptions = {}) => {
  return { type, name, message, ...alternateOptions }
}
let questions = []
questions.push(buildQuestion('input', 'fname', 'What is your first name?'))
questions.push(buildQuestion('input', 'lname', 'What is your last name?'))
questions.push(buildQuestion('input', 'email', 'What is your email?'))

altOptions = {
  choices: ['npm', 'yarn'],
  maxSelected: 1,
  limit: 2,
  hint: 'Make sure you dont mix tools',
  initial: 'yarn',
}
questions.push(buildQuestion('select', 'pkgMgr', 'What package manager would you like to use?', altOptions))

prompt(questions)
  .then((answers) => {
    console.log(answers)
  })
  .catch(console.log)
