const messageFormatters = require("../../../src/lib/changelog/message-formatters");

describe("handler", () => {
	test("throws an error if there is no message formatter defined for the entry's `event`", () => {
		expect(() => {
			messageFormatters.handler({
				event: "invalidEvent"
			});
		}).toThrowErrorMatchingSnapshot();
	});

	test("calls the appropriate message formatter based on the entry's `event`", () => {
		const formatterMethodNames = Object.keys(messageFormatters).filter(
			formatterName => formatterName !== "handler"
		);

		const spies = {};
		formatterMethodNames.forEach(formatterName => {
			spies[formatterName] = jest.spyOn(messageFormatters, formatterName);
		});

		messageFormatters.handler({
			event: "setField",
			field: "license"
		});
		expect(spies.setField).toHaveBeenCalled();

		spies.setField.mockRestore();
		delete spies.setField;

		const spyMethodNames = Object.keys(spies);
		spyMethodNames.forEach(formatterName => {
			expect(spies[formatterName]).not.toHaveBeenCalled();
			spies[formatterName].mockRestore();
			delete spies[formatterName];
		});
	});
});

describe("setField", () => {
	test("returns a correctly formatted message", () => {
		expect(
			messageFormatters.setField({
				field: "license"
			})
		).toEqual("Set value for field 'license' (new field)");

		expect(
			messageFormatters.setField({
				field: "license",
				alreadyExisted: true
			})
		).toEqual("Set value for field 'license' (overwrote existing value)");
	});
});

describe("removeField", () => {
	test("returns a correctly formatted message", () => {
		expect(
			messageFormatters.removeField({
				field: "bugs"
			})
		).toEqual("Removed field 'bugs'");
	});
});

describe("requireDependency", () => {
	test("returns a correctly formatted message", () => {
		expect(
			messageFormatters.requireDependency({
				field: "devDependencies",
				meta: {
					pkg: "jest",
					version: "24.0.0"
				}
			})
		).toEqual(
			"Required package jest@24.0.0 in devDependencies (new dependency)"
		);

		expect(
			messageFormatters.requireDependency({
				field: "devDependencies",
				previousValue: "23.0.0",
				meta: {
					pkg: "jest",
					version: "24.0.0"
				}
			})
		).toEqual(
			"Required package jest@24.0.0 in devDependencies, previously 23.0.0"
		);
	});
});

describe("removeDependency", () => {
	test("returns a correctly formatted message", () => {
		expect(
			messageFormatters.removeDependency({
				field: "devDependencies",
				meta: {
					pkg: "jest"
				}
			})
		).toEqual("Removed package jest from devDependencies");
	});
});

describe("requireScript", () => {
	test("returns a correctly formatted message", () => {
		expect(
			messageFormatters.requireScript({
				alreadyExisted: false,
				meta: {
					stage: "start"
				}
			})
		).toEqual("Required script for stage 'start' (new script)");

		expect(
			messageFormatters.requireScript({
				alreadyExisted: true,
				meta: {
					stage: "start"
				}
			})
		).toEqual(
			"Required script for stage 'start' (overwrote existing command)"
		);
	});
});
