import type { DeepPartial } from '../../types';
import { Screen } from '../../units';
import { createEntityView } from '../entity/entityView';
import type { View } from '../types';

const WALL_THICKNESS_X = Screen.percent(1).w;
const WALL_THICKNESS_Y = Screen.percent(1).h;

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
    width: WALL_THICKNESS_X,
    height: WALL_THICKNESS_Y,
    style: {
      fill: {
        color: 'white',
        opacity: 1,
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

export const createWorldBoundsView = (debugColors: boolean = false) => {
  const topWall = createEntityView({
    ...baseProps,
    id: 'top-wall',
    geometry: {
      ...baseProps.geometry,
      y: -WALL_THICKNESS_X * 0.5,
      width: Screen.w,
    },
  });

  const bottomWall = createEntityView({
    ...baseProps,
    id: 'bottom-wall',
    geometry: {
      ...baseProps.geometry,
      y: Screen.percent(99).h + WALL_THICKNESS_X * 0.5,
      width: Screen.w,
    },
  });

  const leftWall = createEntityView({
    ...baseProps,
    id: 'left-wall',
    geometry: {
      ...baseProps.geometry,
      x: -WALL_THICKNESS_X * 0.5,
      height: Screen.h,
    },
  });

  const rightWall = createEntityView({
    ...baseProps,
    id: 'right-wall',
    geometry: {
      ...baseProps.geometry,
      x: Screen.percent(99).w + WALL_THICKNESS_X * 0.5,
      height: Screen.h,
    },
  });

  return {
    topWall,
    bottomWall,
    leftWall,
    rightWall,
  };
};
