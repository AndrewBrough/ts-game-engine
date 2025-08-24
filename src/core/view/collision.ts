import type { Position, Size } from './types';

export interface Bounds {
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
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

  const getBoundsAroundAnchor = (anchor?: Anchor) => {
    switch (anchor) {
      case 'top-right':
        return {
          left: x - width,
          right: x,
          top: y,
          bottom: y + height,
          width,
          height,
        };

      case 'bottom-left':
        return {
          left: x,
          right: x + width,
          top: y - height,
          bottom: y,
          width,
          height,
        };

      case 'bottom-right':
        return {
          left: x - width,
          right: x,
          top: y - height,
          bottom: y,
          width,
          height,
        };

      case 'center':
        return {
          left: x - width / 2,
          right: x + width / 2,
          top: y - height / 2,
          bottom: y + height / 2,
          width,
          height,
        };

      default:
      case 'top-left':
        return {
          left: x,
          right: x + width,
          top: y,
          bottom: y + height,
          width,
          height,
        };
    }
  };

  const bounds = getBoundsAroundAnchor(anchor);
  bounds.left = Math.round(bounds.left);
  bounds.right = Math.round(bounds.right);
  bounds.top = Math.round(bounds.top);
  bounds.bottom = Math.round(bounds.bottom);
  bounds.width = Math.round(bounds.width);
  bounds.height = Math.round(bounds.height);
  return bounds;
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
export const doBoundsOverlap = (
  bounds1: Bounds,
  bounds2: Bounds
): Bounds | null => {
  const overlapLeft = Math.max(bounds1.left, bounds2.left);
  const overlapRight = Math.min(bounds1.right, bounds2.right);
  const overlapTop = Math.max(bounds1.top, bounds2.top);
  const overlapBottom = Math.min(bounds1.bottom, bounds2.bottom);

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
