const messageFormatters = require('../../../src/lib/changelog/message-formatters');

describe("handler", () => {

    test("throws an error if there is no message formatter defined for the entry's `event`", () => {
        expect(() => {
            messageFormatters.handler({
                event: 'invalidEvent'
            })
        }).toThrowErrorMatchingSnapshot();
    });

    test("throws an error if there is no message formatter defined for the entry's `event`", () => {
        expect(() => {
            messageFormatters.handler({
                event: 'invalidEvent'
            })
        }).toThrowErrorMatchingSnapshot();
    });

});

describe.skip("setField", () => {

    test("...", () => {

    });

});

describe.skip("requireDependency", () => {

    test("...", () => {

    });

});

describe.skip("removeDependency", () => {

    test("...", () => {

    });

});

describe.skip("requireScript", () => {

    test("...", () => {

    });

});
