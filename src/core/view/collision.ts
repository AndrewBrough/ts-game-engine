import type { Geometry, Position, Size } from './types';

export interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
  centerX: number;
  centerY: number;
}

export type Anchor =
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

/**
 * Calculate the bounds of an object based on its position, size, and anchor point
 */
export const calculateBounds = (
  position: Position,
  size: Size,
  anchor?: Anchor
): Bounds => {
  const { x, y } = position;
  const { width, height } = size;
  return {
    left: position.x,
    right: position.x + width,
    top: position.y,
    bottom: position.y + height,
    width,
    height,
    centerX: position.x + width / 2,
    centerY: position.y + height / 2,
  };
};

/**
 * Check if a point is within the bounds of an object
 */
export const isPointInBounds = (point: Position, bounds: Bounds): boolean => {
  return (
    point.x >= bounds.left &&
    point.x <= bounds.right &&
    point.y >= bounds.top &&
    point.y <= bounds.bottom
  );
};

/**
 * Check if two bounds overlap and return the overlap bounds
 */
export const getOverlap = (
  bounds1: Geometry,
  bounds2: Geometry
): Bounds | null => {
  const overlapLeft = Math.max(bounds1.x, bounds2.x);
  const overlapRight = Math.min(
    bounds1.x + bounds1.width,
    bounds2.x + bounds2.width
  );
  const overlapTop = Math.max(bounds1.y, bounds2.y);
  const overlapBottom = Math.min(
    bounds1.y + bounds1.height,
    bounds2.y + bounds2.height
  );

  // Check if there's actually an overlap
  if (overlapLeft >= overlapRight || overlapTop >= overlapBottom) {
    return null;
  }

  const overlapWidth = overlapRight - overlapLeft;
  const overlapHeight = overlapBottom - overlapTop;

  return {
    left: overlapLeft,
    right: overlapRight,
    top: overlapTop,
    bottom: overlapBottom,
    width: overlapWidth,
    height: overlapHeight,
    centerX: overlapLeft + overlapWidth / 2,
    centerY: overlapTop + overlapHeight / 2,
  };
};

/**
 * Check if bounds are within screen boundaries
 */
export const isBoundsInScreen = (
  bounds: Bounds,
  screenWidth: number,
  screenHeight: number
): boolean => {
  return (
    bounds.left >= 0 &&
    bounds.right <= screenWidth &&
    bounds.top >= 0 &&
    bounds.bottom <= screenHeight
  );
};

/**
 * Get the collision bounds for a view with proper anchor point handling
 */
export const getViewBounds = (
  position: Position,
  size: Size,
  anchor: Anchor
): Bounds => {
  return calculateBounds(position, size, anchor);
};
