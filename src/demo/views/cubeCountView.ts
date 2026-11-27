import type { DeepPartial } from '../../core/types';
import { Screen } from '../../core/units';
import { deepMerge } from '../../core/utils/deepMerge';
import type { View } from '../../core/view/types';
import { createView } from '../../core/view/view';
import {
  BOUNCING_ENEMY_SPAWNED,
  type BouncingEnemySpawnedEvent,
} from './bouncingEnemyView';

const FONT_SIZE = Screen.percent(2).w;
const MARGIN = Screen.percent(1).w;

/**
 * Bottom-left text counting bouncing enemies spawned in the scene.
 * Only counts spawns after it is created, so create it before spawning.
 */
export const cubeCountView = (props: DeepPartial<View> = {}) => {
  let count = 0;
  const label = () => `Cubes: ${count}`;

  const defaults: DeepPartial<View> = {
    id: 'cube-count',
    layer: 'UI',
    geometry: {
      x: MARGIN,
      y: Screen.h - FONT_SIZE - MARGIN,
    },
    text: {
      text: label(),
      fontSize: FONT_SIZE,
      style: {
        fill: { color: 'white', opacity: 1 },
      },
    },
  };

  const view = createView(deepMerge(defaults, props));

  // Listener is removed when the scene unloads
  view.events.addEvent(
    BOUNCING_ENEMY_SPAWNED,
    (_e: BouncingEnemySpawnedEvent) => {
      count++;
      view.updateText({ text: label() });
    }
  );

  const getCount = () => count;

  return Object.assign(view, { getCount });
};
