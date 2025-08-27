import {
  addPlayerInput,
  type ControlProps,
} from '../components/input/addPlayerInput';
import { createEntityView } from './entityView';
import type { DeepPartial } from '../../types';
import type { View } from '../types';
import { deepMerge } from '../../utils/deepMerge';

// Create player-specific defaults
const playerDefaults: DeepPartial<View> = {
  id: `player-${crypto.randomUUID()}`,
  layer: 'PLAYER',
  model: {
    speed: 10,
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

export const createPlayerView = (
  props?: DeepPartial<View>,
  controls?: ControlProps
) => {
  // Merge player defaults with provided props
  const mergedProps = deepMerge(playerDefaults, props || {});
  const view = createEntityView(mergedProps);
  addPlayerInput(view, controls);

  return view;
};
