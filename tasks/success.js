const chalk = require('chalk')

let msg = process.argv[2] !== undefined ? process.argv[2] : 'No errors found'

msg = chalk.green(`${msg}`)

console.log('')
console.log(`${chalk.bgGreen.black(' INFO ')} ${msg}`)
console.log('')
