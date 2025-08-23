import type { ViewRenderProps } from './view/types';

export type Units = 'px' | 'vh' | 'vw';

export type Config = ViewRenderProps & {
  units: Units;
};

export const config: Config = {
  units: 'vw',
  anchor: 'top-left',
  position: { x: 0, y: 0 },
  fill: {
    color: 'white',
  },
  stroke: {
    color: 'transparent',
    width: 0,
  },
  shape: 'rect',
  shapeProps: {
    radius: 0,
    width: 0,
    height: 0,
  },
  textProps: {
    text: 'Hello, world!',
    fontSize: 5,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'Arial',
  },
};