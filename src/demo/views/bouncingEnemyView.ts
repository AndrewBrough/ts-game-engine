import type { DeepPartial } from '../../core/types';
import { Screen } from '../../core/units';
import { deepMerge } from '../../core/utils/deepMerge';
import { addCollisionDamage } from '../../core/view/components/events/addCollisionDamage';
import {
  addCollisionBounce,
  addWallBounce,
} from '../../core/view/components/movement';
import { createEnemyView } from '../../core/view/entity/enemyView';
import { defaultEntityProps } from '../../core/view/entity/entityView';
import type { View } from '../../core/view/types';

const baseProps: DeepPartial<View> = {
  model: {
    speed: 5,
    collisionDamage: 10,
  },
};

const randomPosition = () => ({
  x: Math.random() * Screen.w - (defaultEntityProps.geometry?.width ?? 0) / 2,
  y: Math.random() * Screen.h - (defaultEntityProps.geometry?.height ?? 0) / 2,
});

/**
 * An enemy that spawns at a random position and bounces off walls and
 * other views, taking collision damage.
 */
export const bouncingEnemyView = (props: DeepPartial<View> = {}) => {
  const enemy = createEnemyView(
    // chained, not multi-source: deepMerge merges every source against the
    // original target, so a 3rd arg with `geometry` would drop the position
    deepMerge(deepMerge(baseProps, { geometry: randomPosition() }), props)
  );
  enemy.addComponent('wallbounce', addWallBounce(enemy));
  enemy.addComponent('collisionbounce', addCollisionBounce(enemy));
  enemy.addComponent('collisiondamage', addCollisionDamage(enemy));

  window.dispatchEvent(
    new CustomEvent(BOUNCING_ENEMY_SPAWNED, { detail: { enemy } })
  );

  return enemy;
};

export type BouncingEnemyView = ReturnType<typeof bouncingEnemyView>;

/** Fired on window once per bouncing enemy, after it is fully set up. */
export const BOUNCING_ENEMY_SPAWNED = 'bouncingEnemySpawned';
export type BouncingEnemySpawnedEvent = CustomEvent<{
  enemy: BouncingEnemyView;
}>;

export const spawnBouncingEnemies = (
  count: number,
  props: DeepPartial<View> = {}
) => Array.from({ length: count }, () => bouncingEnemyView(props));
