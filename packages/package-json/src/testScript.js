var packageJsonLoads = require('./index.new.js')

var packageJson = packageJsonLoads({'filepath': '../package.json'})

// console.log(packageJson.setField("description", "blah"))

// console.log(packageJson.setField("description", ""))

// console.log(packageJson.hasChangesToWrite())

// packageJson.writeChanges();

console.log(packageJson.removeField("version"))
console.log(packageJson.hasChangesToWrite())

packageJson.writeChanges();


// console.log(packageJson.requireDependency({ pkg: "ebi", version: "1.1.0", field: "devDependencies" }))
// packageJson.writeChanges();

// console.log(packageJson.removeDependency({ pkg: "ebi", field: "devDependencies" }))

// console.log(packageJson.requireScript({lifecycleEvent: 'build', command: 'asap'}))

// packageJson.changelog.getAsMessages();
