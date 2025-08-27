import type { DeepPartial } from '../../types';
import { addAnimations, addCollisions } from '../components';
import {
  addCollisionBounce,
  addForwardMovement,
  addWallBounce,
} from '../components/movement';
import { createEntityView } from './entityView';
import type { View } from '../types';

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
  const view = createEntityView({
    ...enemyDefaults,
    ...props,
  });

  addForwardMovement(view);

  return view;
};
