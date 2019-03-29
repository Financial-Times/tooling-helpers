
const loadPackageJson = require('../src/index.new.js');

describe('exported packageJson methods', () => {

    beforeAll(() => {

    });

    test('getField returns field contents if field exists', () => {
        
        let newPackageJson = loadPackageJson({'filepath': './package-json/test/testPackageJson.json'})
        expect(
            newPackageJson.getField("private")
        ).toEqual(true);
    });

    // test('getField does something if field does not exist', () => {
    //     let newPackageJson = loadPackageJson({'filepath': './package-json/test/testPackageJson.json'})
    //     expect(
    //         newPackageJson.getField("public")
    //     ).toEqual(true);
    // });

    test('setField changes field contents if field exists', () => {
        
        let newPackageJson = loadPackageJson({'filepath': './package-json/test/testPackageJson.json'})
        expect(
            newPackageJson.setField("dependencies", {"ebi": "1.1.0"})
        ).toEqual({"changeWritten": false, "event": "setField", "field": "dependencies", "previousValue": {}});
    });

    test('setField creates field with contents if field does not exist', () => {
        
        let newPackageJson = loadPackageJson({'filepath': './package-json/test/testPackageJson.json'})
        expect(
            newPackageJson.setField("public", false)
        ).toEqual({"changeWritten": false, "event": "setField", "field": "public", "previousValue": false});
    });

    test('removeField deletes field and contents if field exists', () => {
        
        let newPackageJson = loadPackageJson({'filepath': './package-json/test/testPackageJson.json'})
        expect(
            newPackageJson.removeField("dependencies")
        ).toEqual({"changeWritten": false, "event": "removeField", "field": "dependencies", "previousValue": {}});
    });

    // test('removeField does something if field does not exist', () => {
        
    //     let newPackageJson = loadPackageJson({'filepath': './package-json/test/testPackageJson.json'})
    //     newPackageJson.removeField("public")
    //     expect(console.log).toBeCalledWith('field does not exist');

    // });

    

});
