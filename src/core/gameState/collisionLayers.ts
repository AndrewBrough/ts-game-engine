export const LAYERS = [
  'BACKGROUND',
  'WALLS',
  'DEFAULT',
  'PLAYER',
  'ENEMY',
  'UI',
] as const;

export type CollisionLayer = (typeof LAYERS)[number];

export const COLLISION_MATRIX: Record<CollisionLayer, CollisionLayer[]> = {
  BACKGROUND: [],
  WALLS: [],
  DEFAULT: ['DEFAULT'],
  PLAYER: ['DEFAULT', 'WALLS'],
  ENEMY: ['ENEMY', 'PLAYER', 'WALLS'],
  UI: [],
};

console.log({ COLLISION_MATRIX });
