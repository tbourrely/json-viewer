import { describe, expect, it } from 'vitest';
import { createNodes, objectToNode } from './transform-json';

describe('objectToNode', () => {
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
        type: 'default',
        data: { label: "subs" }
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
        type: 'default',
        data: { label: "test" }
      },
    ];

    const got = objectToNode(0, {x: 0, y: 0}, input);
    expect(got.nodes).toEqual(expected);
    expect(got.maxId).toBe(4);
    expect(got.maxPosition).toEqual({ x: 0, y: 600 });
  });
});

describe('createNodes', () => {
  it('should create a flatten list of nodes', () => {
    const input = [
      {
        property: "a",
        subs: ["test", { property: "b" }]
      },
      {
        property: "c",
        subs: ["test2", { property: "d" }]
      }
    ];

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
        type: 'default',
        data: { label: "subs" }
      },
      {
        id: '2',
        position: { x: 0, y: 300 },
        type: 'default',
        data: { label: "test" }
      },
      {
        id: '3',
        position: { x: 0, y: 450 },
        type: 'jsonNode',
        data: { content: { property: "b" } }
      },
      {
        id: '4',
        position: { x: 0, y: 600 },
        type: 'jsonNode',
        data: { content: { property: "c" } }
      },
      {
        id: '5',
        position: { x: 0, y: 750 },
        type: 'default',
        data: { label: "subs" }
      },
      {
        id: '6',
        position: { x: 0, y: 900 },
        type: 'default',
        data: { label: "test2" }
      },
      {
        id: '7',
        position: { x: 0, y: 1050 },
        type: 'jsonNode',
        data: { content: { property: "d" } }
      },
    ];

    const got = createNodes(input);
    expect(got).toEqual(expected);
  });
});
