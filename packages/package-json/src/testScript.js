var packageJson = require('./index.new.js')

var hello = packageJson({'filepath': '../package.json'})


console.log(hello.hasChangesToWrite())
console.log(hello.requireDependency({ pkg: "ebi", version: "1.1.0", field: "devDependencies" }))