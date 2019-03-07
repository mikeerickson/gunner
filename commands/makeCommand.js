module.exports = {
  name: 'make:command',
  description: 'Create a new gunner command',
  flags: {
    name: { aliases: ['n'], description: 'command name', required: true },
    language: { aliases: ['l'], description: 'language', default: 'php' }
  },
  execute(cli) {
    cli.arguments = cli.setDefaultFlags(cli, this.flags)
    cli.print.info(`⚙️ Execute ${this.name} command`)
    cli.print.info(
      `   w/ ${JSON.stringify(cli.arguments)
        .replace(/:/gi, ': ')
        .replace(/,/gi, ', ')}`
    )
  }
}
