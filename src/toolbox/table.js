const Table = require('cli-table3')
const colors = require('ansi-colors')
const pluralize = require('pluralize')
const { clearConfigCache } = require('prettier')

const table = {
  render: (header = [], data = []) => {
    if (data.length === 0) {
      console.log('\n' + colors.red('No Tabld Data'))
      return
    }

    const table = new Table({
      head: header,
      colWidths: [20, process.stdout.columns - 25],
    })

    data.map((item) => {
      table.push(item)
    })
    console.log()
    console.log(table.toString())
  },
  verboseInfo: (header = [], data = {}) => {
    if (Object.keys(data).length === 0) {
      console.log('\n' + colors.red('No Tabld Data'))
      return
    }

    data.sort()
    const table = new Table({
      head: header,
      colWidths: [20, process.stdout.columns - 25],
    })

    data.map((item) => {
      let itemKey = item[0]
      if (typeof item[1] === 'object') {
        let itemStr = pluralize('item', Object.keys(item[1]).length)
        itemStr = Object.keys(item[1]).length + ' ' + itemStr
        keys = colors.yellow(`[${itemStr}] `) + Object.keys(item[1]).sort().join(', ')
        itemKey = colors.magenta(itemKey)
      }

      let value = ''
      if (Array.isArray(item[1])) {
        value = item[1].join(', ')
        let itemStr = pluralize('item', item[1].length)
        value = colors.yellow(`[${itemStr} ${item[1].length}] `) + value
        itemKey = colors.blue(item[0])
      } else {
        value = typeof item[1] === 'string' ? item[1] : typeof item[1] === 'object' ? keys : item[1]
      }

      // for some reason, this is not converted correctly above so it is a 'hack' if you will
      if (itemKey === 'strings') {
        let itemStr = Object.keys(value).length + ' ' + pluralize('item', Object.keys(value).length)
        value = Object.keys(value).join(', ')
        value = colors.yellow(`[${itemStr}] `) + value
      }

      table.push([itemKey, value])
    })
    console.log()
    console.log(table.toString())
  },
}

module.exports = table
