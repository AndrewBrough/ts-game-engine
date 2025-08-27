export const LAYERS = [
  'BACKGROUND',
  'DEFAULT',
  'PLAYER',
  'ENEMY',
  'UI',
] as const;

export type CollisionLayer = (typeof LAYERS)[number];

export const COLLISION_MATRIX: Record<CollisionLayer, CollisionLayer[]> = {
  BACKGROUND: [],
  DEFAULT: ['DEFAULT'],
  PLAYER: ['DEFAULT', 'ENEMY'],
  ENEMY: ['DEFAULT', 'PLAYER'],
  UI: [],
};

export const setCollisionLayers = (
  matrix: Partial<Record<CollisionLayer, CollisionLayer[]>>
) => {
  for (const layer in matrix) {
    COLLISION_MATRIX[layer as CollisionLayer] =
      matrix[layer as CollisionLayer] ??
      COLLISION_MATRIX[layer as CollisionLayer];
  }
};
