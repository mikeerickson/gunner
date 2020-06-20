module.exports = (cli) => {
  cli.machineInfo = ({ toolbox } = cli) => {
    return toolbox.system.run('defaults read loginwindow SystemVersionStampAsString')
  }
}
