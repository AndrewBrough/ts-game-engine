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
    maxHealth: -1,
    health: -1,
    collisionDamage: 0,
  },
  geometry: {
    shape: 'rect',
    width: WALL_THICKNESS_X,
    height: WALL_THICKNESS_Y,
    style: {
      fill: {
        color: 'black',
        opacity: 0.7,
      },
      stroke: {
        color: 'black',
        opacity: 1,
      },
    },
  },
  physics: {
    dampening: 0,
    bounce: 1,
  },
};

export const createWorldBoundsView = (debugColors: boolean = false) => {
  const topWall = createEntityView({
    ...baseProps,
    id: 'top-wall',
    geometry: {
      ...baseProps.geometry,
      y: 0,
      width: Screen.w,
      style: {
        fill: {
          color: debugColors ? 'blue' : 'transparent',
        },
      },
    },
  });

  const bottomWall = createEntityView({
    ...baseProps,
    id: 'bottom-wall',
    geometry: {
      y: Screen.percent(99).h,
      width: Screen.w,
      style: {
        fill: {
          color: debugColors ? 'purple' : 'transparent',
        },
      },
    },
  });

  const leftWall = createEntityView({
    ...baseProps,
    id: 'left-wall',
    geometry: {
      ...baseProps.geometry,
      y: 0,
      height: Screen.h,
      style: {
        fill: {
          color: debugColors ? 'orange' : 'transparent',
        },
      },
    },
  });

  const rightWall = createEntityView({
    ...baseProps,
    id: 'right-wall',
    geometry: {
      ...baseProps.geometry,
      x: Screen.percent(99).w,
      height: Screen.h,
      style: {
        fill: {
          color: debugColors ? 'green' : 'transparent',
        },
      },
    },
  });

  return {
    topWall,
    bottomWall,
    leftWall,
    rightWall,
  };
};
