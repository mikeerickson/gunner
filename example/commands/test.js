module.exports = {
  name: 'test',
  description: 'Gunner Command Example',
  flags: {
    all: { aliases: ['a'], description: 'Use all flags', default: false },
    flag: { aliases: ['f'], description: 'Sample flag', default: false },
    param: { aliases: ['p'], description: 'Sample string parameter', default: 'lowercase' }
  },
  execute(cli) {
    cli.arguments = cli.setDefaultFlags(cli, this.flags)
    cli.print.info(`⚙️  Execute ${this.name} command`)
    cli.print.info(
      `   w/ ${JSON.stringify(cli.arguments)
        .replace(/:/gi, ': ')
        .replace(/,/gi, ', ')}`
    )
  }
}
