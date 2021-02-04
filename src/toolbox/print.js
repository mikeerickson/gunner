/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const messenger = require('@codedungeon/messenger')

module.exports = (quiet = false) => {
  const print = {
    success: (msg = '', label = '') => {
      return quiet ? msg : messenger.success(msg, label)
    },
    error: (msg = '', label = '') => {
      return quiet ? msg : messenger.error(msg, label)
    },
    info: (msg = '', label = '') => {
      return quiet ? msg : messenger.info(msg, label)
    },
    information: (msg = '', label = '') => {
      return quiet ? msg : messenger.information(msg, label)
    },
    warn: (msg = '', label = '') => {
      return quiet ? msg : messenger.warn(msg, label)
    },
    warning: (msg = '', label = '') => {
      return quiet ? msg : messenger.warn(msg, label)
    },
    important: (msg = '', label = '') => {
      return quiet ? msg : messenger.important(msg, label)
    },
    critical: (msg = '', label = '') => {
      return quiet ? msg : messenger.critical(msg, label)
    },
    status: (msg = '', label = '') => {
      return quiet ? msg : messenger.status(msg, label)
    },
    notice: (msg = '', label = '') => {
      return quiet ? msg : messenger.notice(msg, label)
    },
    note: (msg = '', label = '') => {
      return quiet ? msg : messenger.note(msg, label)
    },
    log: (msg = '', label = '') => {
      return quiet ? msg : messenger.log(msg, label)
    },
    debug: (msg = '', label = '') => {
      return quiet ? msg : messenger.debug(msg, label)
    },
    dd: (data) => {
      console.log('')
      messenger.dd(data)
    },
    dump: (data) => {
      console.log('')
      messenger.dump(data)
    },
  }
  return print
}
