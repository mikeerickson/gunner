/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const colors = require('chalk')

let msg = process.argv[2] !== undefined ? process.argv[2] : 'No errors found'

msg = colors.green(`${msg}`)

console.log('')
console.log(`${colors.bgGreen.black(' INFO ')} ${msg}`)
console.log('')
