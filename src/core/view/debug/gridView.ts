import type { DeepPartial } from '../../types';
import { Screen } from '../../units';
import { addLayout } from '../components/addLayout';
import type { View } from '../types';
import { createView, type ViewInstance } from '../view';

const baseGridProps: DeepPartial<View> = {
  layer: 'BACKGROUND',
  geometry: {
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

  const addLine = (id: string, layout: () => DeepPartial<View['geometry']>) => {
    const line = createView({ ...baseGridProps, id });
    // Re-run on resize so lines keep spanning the screen at even spacing
    line.addComponent('layout', addLayout(line, layout));
    grid.push(line);
  };

  for (let i = 0; i <= numLines; i++) {
    // Vertical lines (straight down)
    addLine(`grid-vertical-${i}`, () => ({
      x: (Screen.w / numLines) * i,
      y: 0,
      width: 0,
      height: Screen.h,
    }));
    // Horizontal lines (straight across)
    addLine(`grid-horizontal-${i}`, () => ({
      x: 0,
      y: (Screen.h / numLines) * i,
      width: Screen.w,
      height: 0,
    }));
  }

  return grid;
};
