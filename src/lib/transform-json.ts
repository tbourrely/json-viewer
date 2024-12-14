import { cleanupJson } from './cleanup-json';

type Node = {
  id: string,
  position: XYPosition,
  data: any,
  type: string,
};

type XYPosition = {
  x: number,
  y: number,
};

type ObjectToNodeResult = {
  maxId: number,
  nodes: Node[],
  maxPosition: XYPosition,
}

// TODO: refactor to
// * also return edges
// * take an array of objects as input
// * compute next position
// * compute id properly
export function toNodes(
  objects: any[]
): Node[] {
  return [];
}

export function objectToNode(
  id: number,
  position: XYPosition,
  object: any
): ObjectToNodeResult {
  const result: Node[] = [];
  let localMaxId: number = id;
  let localMaxPosition = position;

  const content = cleanupJson(object);
  if (content) {
    result.push({
      id: String(id),
      position,
      type: 'jsonNode',
      data: { content },
    });
  }

  if (typeof object !== 'object') {
    return {
      maxId: localMaxId,
      maxPosition: localMaxPosition,
      nodes: result,
    };
  }

  const recursiveHandler = (currentObject: any) => {
    const { maxId, maxPosition, nodes } = objectToNode(localMaxId + 1, nextPosition(localMaxPosition), currentObject);
    result.push(...nodes);
    localMaxId = maxId;
    localMaxPosition = maxPosition;
  };

  Object.entries(object).forEach(([key, value]) => {
    if (typeof value !== 'object') {
      return;
    }

    if (Array.isArray(value)) {
      recursiveHandler(key);
      value.forEach(
        (content) => recursiveHandler(content) 
      );
      return;
    }

    recursiveHandler(value);
  });

  return {
    maxId: localMaxId,
    maxPosition: localMaxPosition,
    nodes: result,
  };
}

function nextPosition(position: XYPosition): XYPosition {
  return {
    x: position.x,
    y: position.y + 150,
  };
}
