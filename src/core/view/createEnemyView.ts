import type { DeepPartial } from '../types';
import { Screen } from '../units';
import { alwaysMoveForward } from './animations/alwaysMoveForward';
import { createEntityView } from './player/entityView';
import type { View } from './types';

export const createEnemyView = (props?: DeepPartial<View>) => {
  const entityView = createEntityView({
    id: `enemy-${crypto.randomUUID()}`,
    model: {
      speed: 10,
    },
    geometry: {
      shape: 'rect',
      style: {
        fill: {
          color: 'red',
          ...props?.geometry?.style?.fill,
        },
        stroke: {
          color: 'red',
          opacity: 1,
          width: 2,
          ...props?.geometry?.style?.stroke,
        },
        ...props?.geometry?.style,
      },
      ...props?.geometry,
    },
    ...props,
  });

  alwaysMoveForward(entityView);

  return entityView;
};
