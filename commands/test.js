module.exports = {
  init(cli) {
    cli.arguments.all = cli.arguments.a = cli.arguments.all || cli.arguments.a || true
    cli.arguments.flag = cli.arguments.f = cli.arguments.flag || cli.arguments.f || false
    cli.arguments.param = cli.arguments.p = cli.arguments.param || cli.arguments.p || 'lowercase'
  },
  name: 'test',
  description: 'Gunner Command Example',
  flags: {
    all: { aliases: ['-a'], description: 'Use all flags' },
    flag: { description: 'Sample flag', default: false },
    param: { aliases: ['-p'], description: 'Sample string parameter', default: 'lowercase' }
  },
  run(cli) {
    cli.arguments = cli.setDefaultFlags(cli, this.flags)
    cli.utils.has(this, 'init') ? this.init(cli) : null

    cli.print.info(`⚙️  Execute ${this.name} command`)
    cli.print.info(
      `   w/ ${JSON.stringify(cli.arguments)
        .replace(/:/gi, ': ')
        .replace(/,/gi, ', ')}`
    )
  }
}
