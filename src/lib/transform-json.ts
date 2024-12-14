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

  const recursiveHandler = (currentObject: any) => {
    const { maxId, maxPosition, nodes } = objectToNode(localMaxId + 1, nextPosition(localMaxPosition), currentObject);
    result.push(...nodes);
    localMaxId = maxId;
    localMaxPosition = maxPosition;
  };

  Object.values(object).forEach((item) => {
    if (typeof item !== 'object') {
      return;
    }

    if (Array.isArray(item)) {
      item.forEach(
        (content) => recursiveHandler(content) 
      );
      return;
    }

    recursiveHandler(item);
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
