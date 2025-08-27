import type { DeepPartial } from '../types';
import { deepMerge } from '../utils/deepMerge';
import { alwaysMoveForward } from './animations/alwaysMoveForward';
import { createEntityView } from './player/entityView';
import type { View } from './types';

export const createEnemyView = (props?: DeepPartial<View>) => {
  // Create enemy-specific defaults
  const enemyDefaults: DeepPartial<View> = {
    id: `enemy-${crypto.randomUUID()}`,
    layer: 'ENEMY',
    model: {
      speed: 10,
    },
    geometry: {
      shape: 'rect',
      style: {
        fill: {
          color: 'red',
        },
        stroke: {
          opacity: 0,
        },
      },
    },
  };

  // Merge enemy defaults with provided props
  const mergedProps = deepMerge(enemyDefaults, props || {});

  const entityView = createEntityView(mergedProps);

  alwaysMoveForward(entityView);

  return entityView;
};
