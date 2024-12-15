import { expect, it } from 'vitest';
import { cleanupJson } from './cleanup-json';

it('should not cleanup a string', () => {
  const input = "test";

  const expected = "test";

  const got = cleanupJson(input);
  expect(got).toEqual(expected);
});

it('should remove sub object', () => {
  const input = {
    property: "a",
    subitem: { property: "b" }
  };

  const expected = { property: "a", subitem: '<object>' };

  const got = cleanupJson(input);
  expect(got).toEqual(expected);
});

it('should remove arrays', () => {
  const input = {
    property: "a",
    subitems: [
      { property: "b" },
      "test",
      1
    ]
  };

  const expected = { property: "a", subitems: '<array>' };

  const got = cleanupJson(input);
  expect(got).toEqual(expected);
});

it('should return properties when empty properties', () => {
  const input = {
    property: { test: "a" },
    property2: [{ test: "a" }],
  };

  const expected = { property: '<object>', property2: '<array>' };

  const got = cleanupJson(input);
  expect(got).toEqual(expected);
});

it('should return null when empty input', () => {
  const input = {};
  const got = cleanupJson(input);
  expect(got).toBeNull();
});
