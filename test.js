const { filesystem, system, colors, print } = require('./src/gunner')

const src = filesystem.path.join(__dirname, '..')

print.log(colors.green(`${src}\n`))

print.success(`${src}\n`, 'SUCCESS')
