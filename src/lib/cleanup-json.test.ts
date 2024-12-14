import { expect, it } from 'vitest';
import { cleanupJson } from './cleanup-json';

it('should remove sub object', () => {
  const input = {
    property: "a",
    subitem: { property: "b" }
  };

  const expected = { property: "a" };

  const got = cleanupJson(input);
  expect(got).toEqual(expected);
});

it('should remove objects in arrays', () => {
  const input = {
    property: "a",
    subitems: [
      { property: "b" },
      "test",
      1
    ]
  };

  const expected = { property: "a", subitems: ["test", 1] };

  const got = cleanupJson(input);
  expect(got).toEqual(expected);
});

it('should remove objects in nested arrays', () => {
  const input = {
    property: "a",
    subitems: [
      { property: "b" },
      "test",
      1,
      [ 2, 3, { property: "c" } ]
    ]
  };

  const expected = { property: "a", subitems: ["test", 1, [2, 3]] };

  const got = cleanupJson(input);
  expect(got).toEqual(expected);
});

it('should return null when empty object', () => {
  const input = {
    property: { test: "a" },
    property2: [{ test: "a" }],
  };

  const got = cleanupJson(input);
  expect(got).toBeNull();
});
