import type { View } from './view/types';
import { Screen } from './units';

export const defaultViewConfig: View = {
  id: crypto.randomUUID(),
  model: {
    maxHealth: 100,
    health: 100,
    speed: 1,
    collisionDamage: 0,
  },
  scale: 1,
  layer: 'DEFAULT',
  text: {
    text: '',
    fontSize: Screen.percent(5).w,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'Arial',
    style: {
      fill: {
        color: 'white',
        opacity: 1,
      },
      stroke: {
        color: 'white',
        width: 1,
        opacity: 0,
      },
    },
  },
  geometry: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    shape: undefined,
    style: {
      fill: {
        color: 'black',
        opacity: 1,
      },
      stroke: {
        color: 'white',
        width: 1,
        opacity: 1,
      },
      radii: 5,
    },
  },
  physics: {
    speed: 1,
    force: { x: 0, y: 0 },
    dampening: 0.9,
    bounce: 10,
  },
};
