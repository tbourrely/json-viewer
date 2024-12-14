import { describe, expect, it } from 'vitest';
import { createNodes, objectToNode } from './create-nodes';

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

    const got = objectToNode(0, {x: 0, y: 0}, input, null);
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

    const expectedNodes = [
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

    const expectedEdges = [
      {
        id: '0-1',
        source: '0',
        target: '1',
        type: 'default',
        label: 'property2',
      },
      {
        id: '1-2',
        source: '1',
        target: '2',
        type: 'default',
        label: 'property3',
      },
    ];

    const got = objectToNode(0, {x: 0, y: 0}, input, null);
    expect(got.nodes).toEqual(expectedNodes);
    expect(got.edges).toEqual(expectedEdges);
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

    const expectedNodes = [
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
        position: { x: 150, y: 150 },
        type: 'jsonNode',
        data: { content: { property: "c" } }
      },
      {
        id: '3',
        position: { x: 300, y: 150 },
        type: 'default',
        data: { label: "test" }
      },
    ];

    const expectedEdges = [
      {
        id: '0-1',
        source: '0',
        target: '1',
        type: 'default',
        label: 'subs',
      },
      {
        id: '0-2',
        source: '0',
        target: '2',
        type: 'default',
        label: 'subs',
      },
      {
        id: '0-3',
        source: '0',
        target: '3',
        type: 'default',
        label: 'subs',
      },
    ];

    const got = objectToNode(0, {x: 0, y: 0}, input, null);
    expect(got.nodes).toEqual(expectedNodes);
    expect(got.edges).toEqual(expectedEdges);
    expect(got.maxId).toBe(3);
    expect(got.maxPosition).toEqual({ x: 0, y: 150 });
  });

  it('should handle both objects and arrays', () => {
    const input = {
      property: 'a',
      subs: ['b', 'c'],
      subProperty: {
        property: 'd',
        subs: ['e', 'f']
      }
    };

    const expectedNodes = [
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
        data: { label: 'b' }
      },
      {
        id: '2',
        position: { x: 150, y: 150 },
        type: 'default',
        data: { label: 'c' }
      },
      {
        id: '3',
        position: { x: 0, y: 300 },
        type: 'jsonNode',
        data: { content: { property: "d" } }
      },
      {
        id: '4',
        position: { x: 0, y: 450},
        type: 'default',
        data: { label: 'e' }
      },
      {
        id: '5',
        position: { x: 150, y: 450 },
        type: 'default',
        data: { label: 'f' }
      },
    ];

    const expectedEdges = [
      {
        id: '0-1',
        source: '0',
        target: '1',
        type: 'default',
        label: 'subs',
      },
      {
        id: '0-2',
        source: '0',
        target: '2',
        type: 'default',
        label: 'subs',
      },
      {
        id: '0-3',
        source: '0',
        target: '3',
        type: 'default',
        label: 'subProperty',
      },
      {
        id: '3-4',
        source: '3',
        target: '4',
        type: 'default',
        label: 'subs',
      },
      {
        id: '3-5',
        source: '3',
        target: '5',
        type: 'default',
        label: 'subs',
      },
    ];

    const got = objectToNode(0, { x: 0, y: 0 }, input, null);

    expect(got.nodes).toEqual(expectedNodes);
    expect(got.edges).toEqual(expectedEdges);
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

    const expectedNodes = [
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
        data: { label: "test" }
      },
      {
        id: '2',
        position: { x: 150, y: 150 },
        type: 'jsonNode',
        data: { content: { property: "b" } }
      },
      {
        id: '3',
        position: { x: 0, y: 300 },
        type: 'jsonNode',
        data: { content: { property: "c" } }
      },
      {
        id: '4',
        position: { x: 0, y: 450 },
        type: 'default',
        data: { label: "test2" }
      },
      {
        id: '5',
        position: { x: 150, y: 450 },
        type: 'jsonNode',
        data: { content: { property: "d" } }
      },
    ];

    const expectedEdges = [
      {
        id: '0-1',
        source: '0',
        target: '1',
        type: 'default',
        label: 'subs',
      },
      {
        id: '0-2',
        source: '0',
        target: '2',
        type: 'default',
        label: 'subs',
      },
      {
        id: '3-4',
        source: '3',
        target: '4',
        type: 'default',
        label: 'subs',
      },
      {
        id: '3-5',
        source: '3',
        target: '5',
        type: 'default',
        label: 'subs',
      },
    ];

    const got = createNodes(input);
    expect(got.nodes).toEqual(expectedNodes);
    expect(got.edges).toEqual(expectedEdges);
  });
});
