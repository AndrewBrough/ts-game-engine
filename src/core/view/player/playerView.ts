import { Screen } from '../../units';
import { deepMerge } from '../../utils/deepMerge';
import { handleMove, type ControlProps } from '../events/handleMove';
import { createEntityView } from './entityView';
import type { DeepPartial } from '../../types';
import type { View } from '../types';

export const createPlayerView = (
  props?: DeepPartial<View>,
  controls?: ControlProps
) => {
  // Create player-specific defaults
  const playerDefaults: DeepPartial<View> = {
    id: `player-${crypto.randomUUID()}`,
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
  };

  // Merge player defaults with provided props
  const mergedProps = deepMerge(playerDefaults, props || {});

  const view = createEntityView(mergedProps);

  handleMove(view, controls);

  return view;
};
