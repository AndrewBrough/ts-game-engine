export const LAYERS = [
    'BACKGROUND',
    'DEFAULT',
    'PLAYER',
    'UI',
] as const;

export type CollisionLayer = (typeof LAYERS)[number];

export const COLLISION_MATRIX: Record<CollisionLayer, CollisionLayer[]> = {
    BACKGROUND: [],
    DEFAULT: ['PLAYER'],
    PLAYER: ['DEFAULT'],
    UI: [],
}