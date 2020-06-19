module.exports = (toolbox) => {
  toolbox.machineInfo = () => {
    return toolbox.system.run('defaults read loginwindow SystemVersionStampAsString')
  }
}
