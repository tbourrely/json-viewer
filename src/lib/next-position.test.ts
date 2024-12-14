import { describe, expect, it } from 'vitest';
import { nextPosition } from './next-position';

describe('nextPosition', () => {
  it('should go below', () => {
    expect(
      nextPosition({ x: 0, y: 0 }, false, false, true, false)
    ).toEqual({ x: 0, y: 150 });
  });

  it('should go right', () => {
    expect(
      nextPosition(
        { x: 0, y: 0 },
        false,
        true,
        false,
        false,
      )
    ).toEqual({ x: 150, y: 0 });
  });

  it('should go above', () => {
    expect(
      nextPosition(
        { x: 0, y: 0 },
        true,
        false,
        false,
        false,
      )
    ).toEqual({ x: 0, y: -150 });
  });

  it('should go left', () => {
    expect(
      nextPosition(
        { x: 0, y: 0 },
        false,
        false,
        false,
        true,
      )
    ).toEqual({ x: -150, y: 0 });
  });
});
