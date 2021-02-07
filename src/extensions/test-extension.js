module.exports = (cli) => {
  cli.theFunction = ({ toolbox } = cli) => {
    return toolbox.system.run('defaults read loginwindow SystemVersionStampAsString')
  }
}
