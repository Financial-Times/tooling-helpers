var packageJsonLoads = require('./index.new.js')

var packageJson = packageJsonLoads({'filepath': '../package.json'})


console.log(packageJson.hasChangesToWrite())
// console.log(packageJson.requireDependency({ pkg: "ebi", version: "1.1.0", field: "devDependencies" }))
// console.log(packageJson.removeDependency({ pkg: "ebi", field: "devDependencies" }))

console.log(packageJson.requireScript({lifecycleEvent: 'build', command: 'asap'}))