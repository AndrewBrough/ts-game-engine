export const LAYERS = [
    'BACKGROUND',
    'DEFAULT',
    'PLAYER',
    'UI',
] as const;

export type CollisionLayer = (typeof LAYERS)[number];

export const COLLISION_MATRIX: Record<CollisionLayer, CollisionLayer[]> = {
    BACKGROUND: ['BACKGROUND'],
    DEFAULT: ['DEFAULT', 'PLAYER'],
    PLAYER: ['PLAYER', 'DEFAULT'],
    UI: ['UI'],
}