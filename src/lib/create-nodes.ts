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
  let maxId: number = id;

  if (!object) {
    return {
      maxId,
      nodes,
      edges,
    };
  }

  const nodeInfo = typeof object === 'object' ?
    createJsonNode(maxId, position, object) :
    createNode( maxId, position, 'default', { label: object });

  if (nodeInfo) {
    nodes.push(nodeInfo);

    if (previous) {
      edges.push({
        id: `${previous.id}-${nodeInfo.id}`,
        source: previous.id,
        target: nodeInfo.id,
        type: 'default',
        label: previous.key,
      });
    }
  }


  // no need to parse object properties if it is 
  // not an object
  if (typeof object !== 'object') {
    return {
      maxId,
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
      maxId: localMaxId,
      nodes: subNodes,
      edges: subEdges,
    } = objectToNode(id, position, currentObject, parent);

    nodes.push(...subNodes);
    edges.push(...subEdges);
    maxId = localMaxId;
  };

  Object.entries(object).forEach(([key, value]) => {
    if (typeof value !== 'object') {
      return;
    }

    let newPrevious = null;
    if (nodeInfo) {
      newPrevious = { id: nodeInfo.id, key };
    } else if(previous) {
      newPrevious = { id: previous.id, key: `${previous.key}.${key}` };
    }

    if (Array.isArray(value)) {
      value.forEach(
        (content) => {
          recursiveHandler(
            nextId(maxId),
            position,
            content,
            newPrevious,
          ) 
        }
      );

      return;
    }

    recursiveHandler(
      nextId(maxId),
      position,
      value,
      newPrevious,
    );
  });

  return {
    maxId,
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
