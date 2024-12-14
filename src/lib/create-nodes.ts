import { cleanupJson } from './cleanup-json';
import { nextId } from './next-id';
import type { CreateNodesResult, Edge, ObjectToNodeResult, Previous, XYPosition, Node } from './types';

export const position = { x: 0, y: 0 };

export function createNodes(
  objects: any[]
): CreateNodesResult {
  let id = 0;
  return objects.reduce((acc, cur) => {
    const { maxId, nodes, edges } = objectToNode(id, position, cur, null);
    id = nextId(maxId);
    acc.nodes.push(...nodes);
    acc.edges.push(...edges);
    return acc;
  }, { nodes: [], edges: [] });
}

export function objectToNode(
  id: number,
  position: XYPosition,
  object: any,
  previous: Previous | null
): ObjectToNodeResult {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let localMaxId: number = id;
  let nodeInfo: Node | null = null;

  if (typeof object === 'object') {
    nodeInfo = createJsonNode(localMaxId, position, object);
  } else {
    nodeInfo = createNode(
      localMaxId,
      position,
      'default',
      { label: object },
    );
  }

  if (nodeInfo) {
    nodes.push(nodeInfo);

    if (previous) {
      const edge: Edge = {
        id: `${previous.id}-${nodeInfo.id}`,
        source: previous.id,
        target: nodeInfo.id,
        type: 'default',
        label: previous.key,
      };
      edges.push(edge);
    }
  }

  if (typeof object !== 'object') {
    return {
      maxId: localMaxId,
      nodes,
      edges,
    };
  }

  const recursiveHandler = (
    id: number,
    position: XYPosition,
    currentObject: any,
    parent: Previous | null,
  ) => {
    const {
      maxId,
      nodes: subNodes,
      edges: subEdges,
    } = objectToNode(id, position, currentObject, parent);

    nodes.push(...subNodes);
    edges.push(...subEdges);
    localMaxId = maxId;
  };

  const parent = nodes[nodes.length - 1];
  Object.entries(object).forEach(([key, value]) => {
    if (typeof value !== 'object') {
      return;
    }

    if (Array.isArray(value)) {
      const arrayRoot = nodes[nodes.length - 1];

      value.forEach(
        (content) => {
          recursiveHandler(
            nextId(localMaxId),
            position,
            content,
            arrayRoot ? { id: arrayRoot.id, key } : null,
          ) 
        }
      );

      return;
    }

    recursiveHandler(
      nextId(localMaxId),
      position,
      value,
      parent ? { id: parent.id, key } : null
    );
  });

  return {
    maxId: localMaxId,
    nodes,
    edges,
  };
}

function createJsonNode(id: number, position: XYPosition, object: any): Node | null {
  const cleaned = cleanupJson(object);
  if (cleaned) {
    return createNode(
      id,
      position,
      'jsonNode',
      { content: cleaned },
    );
  }

  return null;
}

function createNode(id: number, position: XYPosition, type: string, data: any): Node {
  return {
    id: String(id),
    position,
    type,
    data,
  }
}
