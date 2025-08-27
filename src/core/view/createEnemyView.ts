import type { DeepPartial } from '../types';
import { alwaysMoveForward } from './animations/alwaysMoveForward';
import { createEntityView } from './player/entityView';
import type { View } from './types';

export const createEnemyView = (props?: DeepPartial<View>) => {
  const entityView = createEntityView({
    id: `enemy-${crypto.randomUUID()}`,
    layer: 'ENEMY',
    model: {
      ...props?.model,
      speed: props?.model?.speed ?? 10,
    },
    geometry: {
      ...props?.geometry,
      shape: props?.geometry?.shape ?? 'rect',
      style: {
        ...props?.geometry?.style,
        fill: {
          color: props?.geometry?.style?.fill?.color ?? 'red',
        },
        stroke: {
          color: props?.geometry?.style?.stroke?.color ?? 'red',
          opacity: props?.geometry?.style?.stroke?.opacity ?? 1,
          width: props?.geometry?.style?.stroke?.width ?? 2,
        },
      },
    },
  });

  alwaysMoveForward(entityView);

  return entityView;
};
