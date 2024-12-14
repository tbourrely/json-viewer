import { expect, it } from 'vitest';
import { objectToNode } from './transform-json';

it('should transform a single node', () => {
  const input = {
    property: "a"
  };

  const expected = [{
    id: '0',
    position: { x: 0, y: 0 },
    type: 'jsonNode',
    data: { content: input }
  }];

  const got = objectToNode(0, {x: 0, y: 0}, input);
  expect(got.nodes).toEqual(expected);
  expect(got.maxId).toBe(0);
  expect(got.maxPosition).toEqual({ x: 0, y: 0 });
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
      id: '0',
      position: { x: 0, y: 0 },
      type: 'jsonNode',
      data: { content: { property: "a" } }
    },
    {
      id: '1',
      position: { x: 0, y: 150 },
      type: 'jsonNode',
      data: { content: { property: "b" } }
    },
    {
      id: '2',
      position: { x: 0, y: 300 },
      type: 'jsonNode',
      data: { content: { property: "c" } }
    },
  ];

  const got = objectToNode(0, {x: 0, y: 0}, input);
  expect(got.nodes).toEqual(expected);
  expect(got.maxId).toBe(2);
  expect(got.maxPosition).toEqual({ x: 0, y: 300 });
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
      },
      "test",
    ]
  };

  const expected = [
    {
      id: '0',
      position: { x: 0, y: 0 },
      type: 'jsonNode',
      data: { content: { property: "a" } }
    },
    {
      id: '1',
      position: { x: 0, y: 150 },
      type: 'jsonNode',
      data: { content: "subs" }
    },
    {
      id: '2',
      position: { x: 0, y: 300 },
      type: 'jsonNode',
      data: { content: { property: "b" } }
    },
    {
      id: '3',
      position: { x: 0, y: 450 },
      type: 'jsonNode',
      data: { content: { property: "c" } }
    },
    {
      id: '4',
      position: { x: 0, y: 600 },
      type: 'jsonNode',
      data: { content: "test" }
    },
  ];

  const got = objectToNode(0, {x: 0, y: 0}, input);
  expect(got.nodes).toEqual(expected);
  expect(got.maxId).toBe(4);
  expect(got.maxPosition).toEqual({ x: 0, y: 600 });
});
