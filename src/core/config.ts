import type { View } from './view/types';
import { Screen } from './units';

export const defaultViewConfig: View = {
  id: crypto.randomUUID(),
  model: {
    maxHealth: 100,
    health: 100,
    speed: 20,
    collisionDamage: 1,
  },
  scale: 1,
  layer: 'DEFAULT',
  fill: {
    color: 'white',
    opacity: 1,
  },
  stroke: {
    color: 'transparent',
    width: 1,
    opacity: 0,
  },
  textProps: {
    text: '',
    fontSize: Screen.percent(20).w,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'Arial',
  },
  geometry: {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    shape: undefined,
  },
  physics: {
    speed: 20,
    force: { x: 0, y: 0 },
    dampening: 0.9,
    bounce: 10,
  },
};
