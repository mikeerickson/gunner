# Gunner

## Description

Codedungeon Slimlined CLI Framework

## Installation

Using npm

```bash
> npm install -g @codedungeon/gunner
```

Using yarn

```bash
> yarn add global @codedungeon/gunner
```

## Usage

- Create `index.js` file and add the following (showing the bare minimum required)

```js
#!/usr/bin/env node

const path = require('path')
let CLI = require('@codedungeon/gunner')

const app = new CLI(process.argv)
  .usage('gunner make:command TestCommand --name test:command')
  .options()
  .examples('make:command TestCommand --name hello')
  .run({ name: 'default' })
```

- Create new command in the `commands` directory (create if it does not exists)

## License

Copyright &copy; 2019-2020 Mike Erickson
Released under the MIT license

### Credits

Gunner written by Mike Erickson

E-Mail: [mike.erickson@codedungeon.io](mailto:mike.erickson@codedungeon.io)

Twitter: [@codedungeon](http://twitter.com/codedungeon)

Website: [codedungeon.io](http://codedungeon.io/gunner)
