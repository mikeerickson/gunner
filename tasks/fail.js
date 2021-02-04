/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('chalk')

// const cmd = process.argv[2] !== undefined ? process.argv[2] + ':' : ''
let msg = process.argv[2] !== undefined ? process.argv[2] : 'Errors found'

msg = colors.red(`${msg}`)

console.log('')
console.log(`${colors.bgRed.black(' ERROR ')} ${msg}`)
console.log('')
