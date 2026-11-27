import { getAllViews } from '../../core/gameState/gameState';
import type { DeepPartial } from '../../core/types';
import { Screen } from '../../core/units';
import { deepMerge } from '../../core/utils/deepMerge';
import type { View } from '../../core/view/types';
import { createView, type ViewInstance } from '../../core/view/view';

const FONT_SIZE = Screen.percent(2).w;
const MARGIN = Screen.percent(1).w;

const isCube = (view: ViewInstance) => view.layer === 'ENEMY';

/**
 * Bottom-left text showing how many cubes are in the scene.
 * Counts cubes already present, then updates each time one is added.
 */
export const cubeCountView = (props: DeepPartial<View> = {}) => {
  let count = getAllViews().filter(isCube).length;
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

  // Fired by createView for every new view; removed when the scene unloads
  view.events.addEvent(
    'viewAdded',
    (e: CustomEvent<{ view: ViewInstance }>) => {
      if (!isCube(e.detail.view)) return;
      count++;
      view.updateText({ text: label() });
    }
  );

  const getCount = () => count;

  return Object.assign(view, { getCount });
};
