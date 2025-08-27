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

// default to 10x10 grid
// higher number = more dense grid
export const gridView = (numLines: number = 10) => {
  const grid: ViewInstance[] = [];
  const lines = 100 / numLines;

  // Create 10 vertical lines (straight down)
  for (let i = 0; i <= numLines; i++) {
    grid.push(
      createView({
        id: `grid-vertical-${i}`,
        ...baseGridProps,
        geometry: {
          ...baseGridProps.geometry,
          x: Screen.percent(lines).w * i,
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
  for (let i = 0; i <= numLines; i++) {
    grid.push(
      createView({
        id: `grid-horizontal-${i}`,
        ...baseGridProps,
        geometry: {
          ...baseGridProps.geometry,
          x: 0,
          y: Screen.percent(lines).h * i,
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
