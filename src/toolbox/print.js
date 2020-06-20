const messenger = require('@codedungeon/messenger')
const print = {
  success: (msg = '', label = '') => {
    return messenger.success(msg, label)
  },
  error: (msg = '', label = '') => {
    return messenger.error(msg, label)
  },
  info: (msg = '', label = '') => {
    return messenger.info(msg, label)
  },
  information: (msg = '', label = '') => {
    return messenger.info(msg, label)
  },
  warn: (msg = '', label = '') => {
    messenger.warn(msg, label)
  },
  warning: (msg = '', label = '') => {
    return messenger.warn(msg, label)
  },
  important: (msg = '', label = '') => {
    return messenger.important(msg, label)
  },
  critical: (msg = '', label = '') => {
    return messenger.critical(msg, label)
  },
  status: (msg = '', label = '') => {
    return messenger.status(msg, label)
  },
  notice: (msg = '', label = '') => {
    return messenger.notice(msg, label)
  },
  note: (msg = '', label = '') => {
    return messenger.note(msg, label)
  },
  log: (msg = '', label = '') => {
    return messenger.log(msg, label)
  },
  debug: (msg = '', label = '') => {
    return messenger.debug(msg, label)
  },
}

module.exports = print
