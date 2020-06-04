module.exports = toolbox => {
  toolbox.helloExtension = () => {
    toolbox.print.info('Hello from Gunner Extension!')
  }
}
