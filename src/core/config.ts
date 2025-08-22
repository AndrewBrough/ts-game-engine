import type { ViewRenderProps } from './view/types';

export type Units = 'px' | 'vh' | 'vw';

export type Config = ViewRenderProps & {
  units: Units;
};

export const config: Config = {
  units: 'vw',
  anchor: 'center',
  fill: {
    color: 'transparent',
  },
  stroke: {
    color: 'transparent',
    width: 0,
  },
  shape: 'rect',
  shapeProps: {
    radius: 0,
    width: 100,
    height: 100,
  },
  textProps: {
    text: 'Hello, world!',
    fontSize: 16,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'Arial',
  },
  position: {
    x: 0,
    y: 0,
  },
};
