import type { DeepPartial } from '../../types';
import { Screen } from '../../units';
import type { View } from '../types';
import { createView, type ViewInstance } from '../view';

const baseGridProps: DeepPartial<View> = {
  layer: 'BACKGROUND',
  geometry: {
    width: 1,
    height: 1,
    shape: 'line',
    style: {
      stroke: {
        color: 'cyan',
        opacity: 1,
        width: 1,
      },
    },
  },
};

export const gridView = () => {
  const grid: ViewInstance[] = [];

  // Create 10 vertical lines (straight down)
  for (let i = 0; i < 11; i++) {
    grid.push(
      createView({
        id: `grid-vertical-${i}`,
        ...baseGridProps,
        geometry: {
          ...baseGridProps.geometry,
          x: Screen.percent(10).w * i,
          y: 0,
          width: 0,
          height: Screen.h,
          style: {
            ...baseGridProps.geometry?.style,
            stroke: {
              ...baseGridProps.geometry?.style?.stroke,
              width: 1,
            },
          },
        },
      })
    );
  }

  // Create 10 horizontal lines (straight across)
  for (let i = 0; i < 11; i++) {
    grid.push(
      createView({
        id: `grid-horizontal-${i}`,
        ...baseGridProps,
        geometry: {
          ...baseGridProps.geometry,
          x: 0,
          y: Screen.percent(10).h * i,
          width: Screen.w,
          height: 0,
          style: {
            ...baseGridProps.geometry?.style,
            stroke: {
              ...baseGridProps.geometry?.style?.stroke,
              width: 1,
            },
          },
        },
      })
    );
  }

  return grid;
};
