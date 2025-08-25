import type { View } from './view/types';

export type Units = 'px' | 'vh' | 'vw';

export type Config = Omit<View, 'id' | 'layer' | 'model' | 'anchor'>;

export const config: Config = {
  scale: 1,
  force: { x: 0, y: 0 },
  physics: {
    dampening: 0.9,
    bounce: 2,
  },
  fill: {
    color: 'transparent',
    opacity: 1,
  },
  stroke: {
    color: 'transparent',
    width: 1,
    opacity: 1,
  },
  geometry: {
    x: 0,
    y: 0,
    radius: 0,
    width: 0,
    height: 0,
  },
  textProps: {
    text: '',
    fontSize: 3,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'Arial',
  },
};
