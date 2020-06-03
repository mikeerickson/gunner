// extensions/sayhello.js
module.exports = api => {
  const { print } = api

  api.sayhello = () => {
    print.info('Hello from an extension!')
  }
}

/*
run: async toolbox => {
  const { sayhello } = toolbox

  sayhello()

  // or

  toolbox.sayhello()
}
*/
