import type { DeepPartial } from '../../types';
import { Screen } from '../../units';
import { addLayout, type LayoutFn } from '../components/addLayout';
import { createEntityView } from '../entity/entityView';
import type { View } from '../types';

const thickness = () => ({ x: Screen.percent(1).w, y: Screen.percent(1).h });

const baseProps: DeepPartial<View> = {
  layer: 'DEFAULT',
  model: {
    speed: 0,
    maxHealth: 0,
    health: 0,
    collisionDamage: 0,
  },
  geometry: {
    shape: 'rect',
    style: {
      fill: {
        color: 'white',
        opacity: 0,
      },
      stroke: {
        color: 'white',
        opacity: 0,
      },
    },
  },
  physics: {
    bounce: 1,
  },
};

// Each wall straddles a screen edge, half inside and half outside.
// Layouts re-run on resize so the walls keep tracking the edges.
const wallLayouts: Record<string, LayoutFn> = {
  'top-wall': () => ({
    x: 0,
    y: -thickness().y * 0.5,
    width: Screen.w,
    height: thickness().y,
  }),
  'bottom-wall': () => ({
    x: 0,
    y: Screen.percent(99).h + thickness().y * 0.5,
    width: Screen.w,
    height: thickness().y,
  }),
  'left-wall': () => ({
    x: -thickness().x * 0.5,
    y: 0,
    width: thickness().x,
    height: Screen.h,
  }),
  'right-wall': () => ({
    x: Screen.percent(99).w + thickness().x * 0.5,
    y: 0,
    width: thickness().x,
    height: Screen.h,
  }),
};

const createWall = (id: keyof typeof wallLayouts) => {
  const wall = createEntityView({ ...baseProps, id });
  wall.addComponent('layout', addLayout(wall, wallLayouts[id]));
  return wall;
};

export const createWorldBoundsView = () => ({
  topWall: createWall('top-wall'),
  bottomWall: createWall('bottom-wall'),
  leftWall: createWall('left-wall'),
  rightWall: createWall('right-wall'),
});
