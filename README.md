# Gunner

## Description

Codedungeon Slim lined CLI Framework

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

const CLI = require('./src/gunner')
const pkgInfo = require('./package.json')

const app = new CLI(process.argv, __dirname)
  .usage(`${pkgInfo.packageName} make:command TestCommand --name test:command`)
  .options(/* if not called, options will be suppressed in help dialog */)
  .version(/* version string override, if not supplied default version info will be displayed */)
  .examples(
    /* if not called, examples will be suppressed in help dialog */
    `${pkgInfo.packageName} make:command TestCommand --name hello`
  )
  .run()
```

- Create new command in the `commands` directory (create if it does not exists)

## License

Copyright &copy; 2019-2021 Mike Erickson
Released under the MIT license

## Credits

Gunner written by Mike Erickson

E-Mail: [mike.erickson@codedungeon.io](mailto:mike.erickson@codedungeon.io)

Twitter: [@codedungeon](http://twitter.com/codedungeon)

Website: [codedungeon.io](http://codedungeon.io/gunner)
