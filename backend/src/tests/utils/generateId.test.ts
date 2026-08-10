import { generateId } from "../../utils/generateId.js";
import { test } from "node:test";
import assert from "node:assert";
import { InvalidIdError } from "../../errors/InputError.js";

const goodInputs = [
  { input: 0, result: 1 },
  { input: 1, result: 2 },
  { input: 100, result: 101 },
  { input: 999, result: 1000 },
];

const badInputs = [NaN, 2.5, -20, Infinity];

//Passsing tests
test("Generates the correct Id", () => {
  goodInputs.forEach((goodInput) => {
    assert.strictEqual(generateId(goodInput.input), goodInput.result);
  });
});

//Test that should throw errors
test("Throws expected errors", () => {
  badInputs.forEach((badInput) => {
    assert.throws(() => generateId(badInput), InvalidIdError);
  });
});
