import type { XYPosition } from "./types";

export function nextPosition(
  position: XYPosition,
  top?: boolean,
  right?: boolean,
  bottom?: boolean,
  left?: boolean,
): XYPosition {
  const next = {
    x: position.x,
    y: position.y,
  };

  if (top) next.y -= 150;
  if (right) next.x += 150;
  if (bottom) next.y += 150;
  if (left) next.x -= 150;

  return next;
}

