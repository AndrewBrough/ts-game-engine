import type { DeepPartial } from '../../types';
import { addForwardMovement } from '../components/movement';
import { createEntityView } from './entityView';
import type { View } from '../types';
import { deepMerge } from '../../utils/deepMerge';

// Create enemy-specific defaults
const enemyDefaults: DeepPartial<View> = {
  layer: 'ENEMY',
  geometry: {
    shape: 'rect',
    style: {
      fill: {
        color: 'red',
      },
      stroke: {
        color: 'red',
        opacity: 1,
      },
    },
  },
};

export const createEnemyView = (props?: DeepPartial<View>) => {
  const mergedProps = deepMerge(enemyDefaults, props);
  const view = createEntityView({
    ...mergedProps,
    id: props?.id ?? `enemy-${crypto.randomUUID()}`,
  });

  view.addComponent('forwardMovement', addForwardMovement(view));

  return view;
};
