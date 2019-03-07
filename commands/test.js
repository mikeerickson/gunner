module.exports = {
  name: 'test',
  description: 'Example Command',
  flags: {
    all: { aliases: ['a'], description: 'Use all flags' },
    flag: { description: 'Sample flag', default: false },
    param: { aliases: ['p'], description: 'Sample string parameter', default: 'lowercase' }
  },
  execute(cli) {
    cli.arguments = cli.setDefaultFlags(cli, this.flags)
    cli.utils.has(this, 'init') ? this.init(cli) : null

    cli.print.info(`⚙️ Execute ${this.name} command`)
    cli.print.info(
      `   w/ ${JSON.stringify(cli.arguments)
        .replace(/:/gi, ': ')
        .replace(/,/gi, ', ')}`
    )
  }
}
