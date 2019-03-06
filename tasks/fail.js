const chalk = require('chalk')

const cmd = process.argv[2] !== undefined ? process.argv[2] + ':' : ''
let msg = process.argv[3] !== undefined ? process.argv[3] : 'Errors Found'

msg = chalk.red(`${cmd} ${msg}`)

console.log('')
console.log(`${chalk.bgRed.black(' ERROR ')} ${msg}`)
console.log('')
