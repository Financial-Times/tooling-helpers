const {
	deepCloneObject,
	formatObjectAsJson
} = require("../../src/lib/helpers");

const object = {
	some: "field",
	another: {
		bunch: false,
		of: 123,
		fields: "yay"
	}
};

describe("`deepCloneObject` returns a deep cloned object", () => {
	test("where the object is not a reference to the original object", () => {
		const objectClone = deepCloneObject(object);
		expect(objectClone).not.toBe(object);
	});

	test("where nested objects are not references to the original nested object", () => {
		const objectClone = deepCloneObject(object);
		expect(objectClone.another).not.toBe(object.another);
		objectClone.another.bunch = true;
		expect(object.another.bunch).toBe(false);
	});
});

/**
 * The `formatObjectAsJson` does not currently have any logic to test,
 * so for now we're just checking that it doesn't throw any errors.
 */
test("`formatObjectAsJson` does not throw an error", () => {
	expect(() => {
		formatObjectAsJson();
	}).not.toThrowError();

	expect(() => {
		formatObjectAsJson(object);
	}).not.toThrowError();
});
