const { filesystem, system, colors, print } = require('./src/gunner')

const src = filesystem.path.join(__dirname, '..')

print.log(colors.green(src))
print.success(src, 'SUCCESS')
