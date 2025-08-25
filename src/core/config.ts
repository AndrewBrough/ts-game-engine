import type { View } from './view/types';
import { Screen } from './units';

const minSize = Screen().w / 10;

export const defaultViewConfig: View = {
  id: crypto.randomUUID(),
  model: {
    maxHealth: 100,
    health: 100,
    speed: 20,
    collisionDamage: 0,
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
    opacity: 1,
  },
  textProps: {
    text: '',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'Arial',
  },
  geometry: {
    x: Screen().center.x,
    y: Screen().center.y,
    width: minSize,
    height: minSize,
  },
  physics: {
    speed: 20,
    force: { x: 0, y: 0 },
    dampening: 0.9,
    bounce: 10,
  },
};
