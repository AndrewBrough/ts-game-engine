import type { DeepPartial } from './types';
import type { ViewRenderProps } from './view/types';

export type Units = 'px' | 'vh' | 'vw';

export type Config = ViewRenderProps & {
  units: Units;
};

export const config: Config = {
  units: 'vw',
  anchor: 'top-left',
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
    width: 0,
    height: 0,
  },
  textProps: {
    text: 'Hello, world!',
    fontSize: 1,
    fontWeight: 'normal',
    fontStyle: 'normal',
    fontFamily: 'Arial',
  },
  position: {
    x: 0,
    y: 0,
  },
};

export const textConfig: DeepPartial<Config> = {
  shape: 'text',
  fill: {
    color: 'white',
  },
  stroke: {
    color: 'transparent',
    width: 0,
  },
};