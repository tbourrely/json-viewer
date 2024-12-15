import { describe, expect, it } from 'vitest';
import { createNodes, objectToNode, position } from './create-nodes';
import type { Edge } from './types';

describe('objectToNode', () => {
  it('should transform a single node', () => {
    const input = {
      property: "a"
    };

    const expected = [{
      id: '0',
      position,
      type: 'jsonNode',
      data: { content: input }
    }];

    const got = objectToNode(0, position, input, null);
    expect(got.nodes).toEqual(expected);
    expect(got.maxId).toBe(0);
  });

  it('should transform nested nodes without other properties', () => {
    const input = {
      property: 'a',
      subs: [
        {
          resubs: [
            {
              property: 'b'
            }
          ]
        }
      ]
    };

    const expectedNodes = [
      {
        id: '0',
        position,
        type: 'jsonNode',
        data: { content: { property: 'a', subs: '<array>' } }
      },
      {
        id: '1',
        position,
        type: 'jsonNode',
        data: { content: { resubs: '<array>' } }
      },
      {
        id: '2',
        position,
        type: 'jsonNode',
        data: { content: { property: 'b' } }
      },
    ];

    const expectedEdges: Edge[] = [
      {
        id: '0-1',
        source: '0',
        target: '1',
        type: 'default',
        label: 'subs',
      },
      {
        id: '1-2',
        source: '1',
        target: '2',
        type: 'default',
        label: 'resubs',
      },
    ];

    const got = objectToNode(0, position, input, null);
    expect(got.nodes).toEqual(expectedNodes);
    expect(got.edges).toEqual(expectedEdges);
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
        position,
        type: 'jsonNode',
        data: { content: { property: "a", property2: '<object>' } }
      },
      {
        id: '1',
        position,
        type: 'jsonNode',
        data: { content: { property: "b" , property3: '<object>'} }
      },
      {
        id: '2',
        position,
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

    const got = objectToNode(0, position, input, null);
    expect(got.nodes).toEqual(expectedNodes);
    expect(got.edges).toEqual(expectedEdges);
    expect(got.maxId).toBe(2);
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
        position,
        type: 'jsonNode',
        data: { content: { property: "a", subs: '<array>' } }
      },
      {
        id: '1',
        position,
        type: 'jsonNode',
        data: { content: { property: "b" } }
      },
      {
        id: '2',
        position,
        type: 'jsonNode',
        data: { content: { property: "c" } }
      },
      {
        id: '3',
        position,
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

    const got = objectToNode(0, position, input, null);
    expect(got.nodes).toEqual(expectedNodes);
    expect(got.edges).toEqual(expectedEdges);
    expect(got.maxId).toBe(3);
  });

  it('should handle both objects and arrays', () => {
    const input = {
      property: 'a',
      subs: ['b', 'c'],
      subProperty: {
        property: 'd',
        subs: ['e', 'f']
      },
      subObjects: [
        {
          property: 'g',
          subs: [],
        },
        {
          property: 'h',
          items: ['j', 'k'],
          subs: [
            {
              property: 'l'
            }
          ]
        }
      ]
    };

    const expectedNodes = [
      {
        id: '0',
        position,
        type: 'jsonNode',
        data: { content: { property: "a", subs: '<array>', subProperty: '<object>', subObjects: '<array>' } }
      },
      {
        id: '1',
        position,
        type: 'default',
        data: { label: 'b' }
      },
      {
        id: '2',
        position,
        type: 'default',
        data: { label: 'c' }
      },
      {
        id: '3',
        position,
        type: 'jsonNode',
        data: { content: { property: "d", subs: '<array>' } }
      },
      {
        id: '4',
        position,
        type: 'default',
        data: { label: 'e' }
      },
      {
        id: '5',
        position,
        type: 'default',
        data: { label: 'f' }
      },
      {
        id: '6',
        position,
        type: 'jsonNode',
        data: { content: { property: "g", subs: '<array>' } }
      },
      {
        id: '7',
        position,
        type: 'jsonNode',
        data: { content: { property: "h", items: '<array>', subs: '<array>' } }
      },
      {
        id: '8',
        position,
        type: 'default',
        data: { label: 'j' }
      },
      {
        id: '9',
        position,
        type: 'default',
        data: { label: 'k' }
      },
      {
        id: '10',
        position,
        type: 'jsonNode',
        data: { content: { property: "l" } }
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
      {
        id: '0-6',
        source: '0',
        target: '6',
        type: 'default',
        label: 'subObjects',
      },
      {
        id: '0-7',
        source: '0',
        target: '7',
        type: 'default',
        label: 'subObjects',
      },
      {
        id: '7-8',
        source: '7',
        target: '8',
        type: 'default',
        label: 'items',
      },
      {
        id: '7-9',
        source: '7',
        target: '9',
        type: 'default',
        label: 'items',
      },
      {
        id: '7-10',
        source: '7',
        target: '10',
        type: 'default',
        label: 'subs',
      },
    ];

    const got = objectToNode(0, position, input, null);

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
        position,
        type: 'jsonNode',
        data: { content: { property: "a", subs: '<array>' } }
      },
      {
        id: '1',
        position,
        type: 'default',
        data: { label: "test" }
      },
      {
        id: '2',
        position,
        type: 'jsonNode',
        data: { content: { property: "b" } }
      },
      {
        id: '3',
        position,
        type: 'jsonNode',
        data: { content: { property: "c", subs: '<array>' } }
      },
      {
        id: '4',
        position,
        type: 'default',
        data: { label: "test2" }
      },
      {
        id: '5',
        position,
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
