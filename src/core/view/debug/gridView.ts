import type { DeepPartial } from '../../types';
import { Screen } from '../../units';
import type { View } from '../types';
import { createView, type ViewInstance } from '../view';

const baseGridProps: DeepPartial<View> = {
  layer: 'BACKGROUND',
  geometry: {
    width: 1,
    height: 1,
    shape: 'rect',
    style: {
      fill: {
        opacity: 0,
      },
      stroke: {
        color: 'cyan',
        opacity: 1,
        width: 1,
      },
    },
  },
};

export const gridView = () => {
  const grid: ViewInstance[][] = [];
  for (let i = 0; i < 10; i++) {
    grid[i] = [];
    for (let j = 0; j < 10; j++) {
      grid[i][j] = createView({
        id: `grid-${i}-${j}`,
        ...baseGridProps,
        geometry: {
          ...baseGridProps.geometry,
          x: Screen.percent(10).w * i,
          y: Screen.percent(10).h * j,
          width: Screen.percent(10).w,
          height: Screen.percent(10).h,
        },
      });
    }
  }

  return grid;
};
