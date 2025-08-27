import type { DeepPartial } from '../../types';
import { addAnimations, addCollisions } from '../components';
import {
  addCollisionBounce,
  addForwardMovement,
  addWallBounce,
} from '../components/movement';
import { createEntityView } from './entityView';
import type { View } from '../types';
import { deepMerge } from '../../utils/deepMerge';
import { addHealthOpacityStyle } from '../components/styles/addHealthOpacityStyle';

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

export const createEnemyView = (props?: DeepPartial<View>) => {
  const mergedProps = deepMerge(enemyDefaults, props);
  const view = createEntityView({
    ...mergedProps,
    id: `enemy-${crypto.randomUUID()}`,
  });

  view.addComponent('forwardMovement', addForwardMovement(view));

  return view;
};
