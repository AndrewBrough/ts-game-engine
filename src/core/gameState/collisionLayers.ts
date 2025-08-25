export const LAYERS = [
  'BACKGROUND',
  'WALLS',
  'DEFAULT',
  'PLAYER',
  'UI',
] as const;

export type CollisionLayer = (typeof LAYERS)[number];

export const COLLISION_MATRIX: Record<CollisionLayer, CollisionLayer[]> = {
  BACKGROUND: [],
  WALLS: [],
  DEFAULT: ['PLAYER', 'WALLS'],
  PLAYER: ['DEFAULT', 'WALLS'],
  UI: [],
};

console.log({ COLLISION_MATRIX });
