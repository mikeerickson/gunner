# Gunner

## Description

Codedungeon CLI Framework

### Installation

Using npm

```bash
> npm install -S gunner
```

Using yarn

```bash
> yarn add gunner
```

### Usage

- Create `index.js` file and add the following (showing the bare minimum required)

```js
#!/usr/bin/env node

const path = require('path')

let CLI = require('../src/gunner')
new CLI(process.argv, path.dirname(__filename))
```

- Create new command in the `commands` directory (create if it does not exists)

### License

Copyright &copy; 2019 Mike Erickson
Released under the MIT license

### Credits

Gunner written by Mike Erickson

E-Mail: [codedungeon@gmail.com](mailto:codedungeon@gmail.com)

Twitter: [@codedungeon](http://twitter.com/codedungeon)

Website: [codedungeon.io](http://codedungeon.io)
