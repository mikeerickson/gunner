const colors = require('chalk')

let msg = process.argv[2] !== undefined ? process.argv[2] : 'No errors found'

msg = colors.green(`${msg}`)

console.log('')
console.log(`${colors.bgGreen.black(' INFO ')} ${msg}`)
console.log('')
