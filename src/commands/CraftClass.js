module.exports = {
  name: 'craft:class',
  description: 'Craft Standard Class',
  disabled: false,
  hidden: false,
  usage: 'Do something cool, after all this is your command!',
  flags: {
    // example flag, adjust accordingly
    constructor: { aliases: ['c'], description: 'Include Constructor Method' },
    test: { aliases: ['u'], description: 'Create Class Unit Test' },
    template: { aliases: ['t'], description: 'Template path (override configuration file)' },
  },
  execute(toolbox) {
    let constructor = toolbox.getOptionValue(toolbox.arguments, ['construtor', 'c'])
    let test = toolbox.getOptionValue(toolbox.arguments, ['test', 'u'])
    let template = toolbox.getOptionValue(toolbox.arguments, ['template', 't'])
    if (template.length === 0) {
      template = toolbox.path.join(toolbox.env.projectRoot, 'templates', 'class.mustache')
    }

    let overwrite = toolbox.getOptionValue(toolbox.arguments, ['overwrite', 'w'])

    console.log(template)

    if (!toolbox.fs.existsSync(template)) {
      toolbox.print.error(template)
      toolbox.print.error('\n🚫  Template Does Not Exist')
    } else {
      //
      toolbox.print.debug('proceed to the route')
    }
    console.log({ constructor, test, template, overwrite })
  },
}
