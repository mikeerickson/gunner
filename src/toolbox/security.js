// obfuscate with https://obfuscator.io/
// NOTE: Make sure to only use default settings, otherwise result seems to blow up node
// library - https://github.com/javascript-obfuscator/javascript-obfuscator
const bcrypt = require('bcrypt')
module.exports = {
  generate: (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
  },
  validate: (password) => {
    return bcrypt.compareSync(password, '$2b$10$pWF2yUmbva6dMcd9jPwD0uxIgXUh4b.NtxwjWr724Lu5fhKtehntS')
  },
}
