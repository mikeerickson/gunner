/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

const messenger = require('@codedungeon/messenger')

class Printer {
  constructor(args = { quiet: false }) {
    this.args = args
  }
  success(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.success(msg, info)
  }
  error(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.error(msg, info)
  }
  info(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.info(msg, info)
  }
  information(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.info(msg, info)
  }
  warn(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.warn(msg, info)
  }
  warning(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.warning(msg, info)
  }
  important(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.important(msg, info)
  }
  critical(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.critical(msg, info)
  }
  status(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.status(msg, info)
  }
  note(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.note(msg, info)
  }
  notice(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.notice(msg, info)
  }
  log(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.log(msg, info)
  }
  debug(msg = '', info = '') {
    return this.args.quiet ? msg : messenger.debug(msg, info)
  }
}

module.exports = (args = {}) => {
  return new Printer(args)
}
