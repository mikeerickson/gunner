module.exports = (cli) => {
  cli.myFunction = ({ toolbox } = cli) => {
    return toolbox.system.run('defaults read loginwindow SystemVersionStampAsString')
  }
}
