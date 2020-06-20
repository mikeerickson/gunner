module.exports = (cli) => {
  cli.helloExtension = ({ toolbox } = cli) => {
    return toolbox.print.info('Hello from Gunner Extension!')
  }
}
