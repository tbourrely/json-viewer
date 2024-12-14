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

// TODO: refactor to
// * also return edges
// * take an array of objects as input
// * compute next position
// * compute id properly
export function toNodes(
  id: string,
  position: XYPosition,
  object: any
): Node[] {
  let parsedId = parseInt(id) || 0;
  const result: Node[] = [];

  const content = cleanupJson(object);

  if (content) {
    result.push({
      id,
      position,
      type: 'jsonNode',
      data: { content },
    });
  }

  Object.values(object).forEach((item) => {
    if (Array.isArray(item)) {
      item.forEach(
        (content) => {
          parsedId += 1;
          result.push(...toNodes(String(parsedId), position, content))
        } 
      );
      return;
    }

    if (typeof item === 'object') {
      parsedId += 1;
      result.push(...toNodes(String(parsedId), position, item));
    }
  });

  return result;
}
