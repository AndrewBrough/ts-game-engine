import { Screen } from '../../units';
import { handleMove, type ControlProps } from '../events/handleMove';
import { createEntityView } from './entityView';
import type { DeepPartial } from '../../types';
import type { View } from '../types';

export const createPlayerView = (
  props?: DeepPartial<View>,
  controls?: ControlProps
) => {
  const view = createEntityView({
    id: 'player',
    layer: 'PLAYER',
    model: {
      speed: 15,
    },
    geometry: {
      style: {
        fill: {
          color: 'blue',
        },
        stroke: {
          color: 'blue',
          opacity: 1,
          width: 2,
        },
      },
    },
    ...props,
  });

  handleMove(view, controls);

  return view;
};
