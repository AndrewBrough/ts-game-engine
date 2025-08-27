import type { Geometry, Position, Size, View } from './types';

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
 * Get the minimum overlap between two views
 */
export const getMinOverlap = (view: View, v: View) => {
  const viewLeft = view.geometry.x;
  const viewRight = view.geometry.x + view.geometry.width;
  const viewTop = view.geometry.y;
  const viewBottom = view.geometry.y + view.geometry.height;

  const vLeft = v.geometry.x;
  const vRight = v.geometry.x + v.geometry.width;
  const vTop = v.geometry.y;
  const vBottom = v.geometry.y + v.geometry.height;

  // Calculate overlap amounts on each side
  const overlapLeft = Math.abs(viewRight - vLeft);
  const overlapRight = Math.abs(vRight - viewLeft);
  const overlapTop = Math.abs(viewBottom - vTop);
  const overlapBottom = Math.abs(vBottom - viewTop);

  // Find the smallest overlap to determine the collision side
  const minOverlap = Math.min(
    overlapLeft,
    overlapRight,
    overlapTop,
    overlapBottom
  );

  let normal = { x: 0, y: 0 };
  if (minOverlap === overlapLeft) {
    // Collision on left side of view (view is to the right of v)
    normal = { x: 1, y: 0 };
  } else if (minOverlap === overlapRight) {
    // Collision on right side of view (view is to the left of v)
    normal = { x: -1, y: 0 };
  } else if (minOverlap === overlapTop) {
    // Collision on top side of view (view is below v)
    normal = { x: 0, y: 1 };
  } else if (minOverlap === overlapBottom) {
    // Collision on bottom side of view (view is above v)
    normal = { x: 0, y: -1 };
  }

  return {
    minOverlap,
    normal,
  };
};

export const getCollision = (
  view: View,
  v: View,
  normal: Position,
  deltaTime: number,
  boundsOverlap: Bounds | null
) => {
  const collision = {
    id: getCollisionId(view, v),
    view1: view,
    view2: v,
    contactPoint: {
      x: boundsOverlap?.left ?? 0,
      y: boundsOverlap?.top ?? 0,
    },
    normal,
    deltaTime,
  };

  return collision;
};

export const getCollideEventId = (view: View) => `${view.id}-collide`;
export const getCollisionEventId = (view: View) => `${view.id}-collision-event`;
export const getCollisionId = (view1: View, view2: View) =>
  `${view1.id}-${view2.id}`;

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
