/*-------------------------------------------------------------------------------------------
 * Copyright (c) 2018-2021 Mike Erickson / Codedungeon.  All rights reserved.
 * Licensed under the MIT license.  See LICENSE in the project root for license information.
 * -----------------------------------------------------------------------------------------*/

module.exports = (cli) => {
  cli.machineInfo = ({ toolbox } = cli) => {
    return toolbox.system.run('defaults read loginwindow SystemVersionStampAsString')
  }
}
