const messenger = require('@codedungeon/messenger')
const print = {
  success: (msg = '', label = '') => {
    messenger.success(msg, label)
  },
  error: (msg = '', label = '') => {
    messenger.error(msg, label)
  },
  info: (msg = '', label = '') => {
    messenger.info(msg, label)
  },
  warn: (msg = '', label = '') => {
    messenger.warn(msg, label)
  },
  warning: (msg = '', label = '') => {
    messenger.warn(msg, label)
  },
  important: (msg = '', label = '') => {
    messenger.important(msg, label)
  },
  critical: (msg = '', label = '') => {
    messenger.critical(msg, label)
  },
  status: (msg = '', label = '') => {
    messenger.status(msg, label)
  },
  notice: (msg = '', label = '') => {
    messenger.notice(msg, label)
  },
  note: (msg = '', label = '') => {
    messenger.note(msg, label)
  },
  log: (msg = '', label = '') => {
    messenger.log(msg, label)
  },
  debug: (msg = '', label = '') => {
    messenger.debug(msg, label)
  },
}

module.exports = print
