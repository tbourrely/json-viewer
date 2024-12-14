import { expect, it } from 'vitest';
import { toNodes } from './transform-json';

it('should transform a single node', () => {
  const input = {
    property: "a"
  };

  const expected = [{
    id: '1',
    position: { x: 0, y: 0 },
    type: 'jsonNode',
    data: { content: input }
  }];

  const got = toNodes('1', {x: 0, y: 0}, input);
  expect(got).toEqual(expected);
});

it('should transform a single nested node', () => {
  const input = {
    property: "a",
    property2: {
      property: "b",
      property3: {
        property: "c"
      }
    }
  };

  const expected = [
    {
      id: '1',
      position: { x: 0, y: 0 },
      type: 'jsonNode',
      data: { content: { property: "a" } }
    },
    {
      id: '2',
      position: { x: 0, y: 0 },
      type: 'jsonNode',
      data: { content: { property: "b" } }
    },
    {
      id: '3',
      position: { x: 0, y: 0 },
      type: 'jsonNode',
      data: { content: { property: "c" } }
    },
  ];

  const got = toNodes('1', {x: 0, y: 0}, input);
  expect(got).toEqual(expected);
});

it('should transform nodes in arrays', () => {
  const input = {
    property: "a",
    subs: [
      {
        property: "b"
      },
      {
        property: "c"
      }
    ]
  };

  const expected = [
    {
      id: '1',
      position: { x: 0, y: 0 },
      type: 'jsonNode',
      data: { content: { property: "a" } }
    },
    {
      id: '2',
      position: { x: 0, y: 0 },
      type: 'jsonNode',
      data: { content: { property: "b" } }
    },
    {
      id: '3',
      position: { x: 0, y: 0 },
      type: 'jsonNode',
      data: { content: { property: "c" } }
    },
  ];

  const got = toNodes('1', {x: 0, y: 0}, input);
  expect(got).toEqual(expected);
});
