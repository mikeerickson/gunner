const chalk = require('chalk')

// const cmd = process.argv[2] !== undefined ? process.argv[2] + ':' : ''
let msg = process.argv[2] !== undefined ? process.argv[2] : 'Errors found'

msg = chalk.red(`${msg}`)

console.log('')
console.log(`${chalk.bgRed.black(' ERROR ')} ${msg}`)
console.log('')
