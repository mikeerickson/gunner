const chalk = require('chalk')

const cmd = process.argv[2] !== undefined ? process.argv[2] + ':' : ''
let msg = process.argv[3] !== undefined ? process.argv[3] : 'No Errors Found'

msg = chalk.green(`${cmd} ${msg}`)

console.log('')
console.log(`${chalk.bgGreen.black(' INFO ')} ${msg}`)
console.log('')
