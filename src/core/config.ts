import type { View } from './view/types';

export type Units = 'px' | 'vh' | 'vw';

export type Config = Omit<View, 'id' | 'layer' | 'model'> & {
  units: Units;
};

export const config: Config = {
  units: 'vh',
  anchor: 'top-left',
  position: { x: 0, y: 0 },
  bounds: { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 },
  scale: 1,
  force: { x: 0, y: 0 },
  fill: {
    color: 'transparent',
    opacity: 1,
  },
  stroke: {
    color: 'transparent',
    width: 1,
    opacity: 1,
  },
  shape: 'rect',
  shapeProps: {
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
