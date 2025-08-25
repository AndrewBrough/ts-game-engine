import type { DeepPartial } from '../../types';
import { createEntityView } from '../player/entityView';
import type { EntityView } from '../types';

const WALL_THICKNESS = 5;
const baseProps = {
  layer: 'WALLS',
  shape: 'rect',
  relativeTo: 'center',
  anchor: 'center',
  geometry: {
    width: 100,
    height: WALL_THICKNESS,
    units: ['vw', 'vh'],
  },
  fill: {
    color: 'black',
    opacity: 0.7,
  },
  stroke: {
    color: 'black',
    opacity: 1,
  },
  textProps: {
    text: '',
  },
} as DeepPartial<EntityView>;

export const createWorldBoundsView = () => {
  createEntityView({
    ...baseProps,
    id: 'top-wall',
    position: {
      x: 0,
      y: 0,
    },
    physics: {
      dampening: 0.9,
      bounce: 200,
    },
    geometry: {
      ...baseProps.geometry,
      width: 100,
      height: WALL_THICKNESS,
    },
    fill: {
      color: 'blue',
    },
  });

  createEntityView({
    ...baseProps,
    id: 'bottom-wall',
    position: {
      x: 0,
      y: 85,
    },
    physics: {
      dampening: 0.9,
      bounce: 200,
    },
    geometry: {
      ...baseProps.geometry,
      width: 100,
      height: WALL_THICKNESS,
    },
    fill: {
      color: 'blue',
    },
  });

  createEntityView({
    ...baseProps,
    id: 'left-wall',
    position: {
      x: 0,
      y: 0,
    },
    physics: {
      dampening: 0.9,
      bounce: 200,
    },
    geometry: {
      ...baseProps.geometry,
      width: WALL_THICKNESS,
      height: 100,
    },
    fill: {
      color: 'orange',
    },
  });

  createEntityView({
    ...baseProps,
    id: 'right-wall',
    position: {
      x: 90,
      y: 0,
    },
    physics: {
      dampening: 0.9,
      bounce: 200,
    },
    geometry: {
      ...baseProps.geometry,
      width: WALL_THICKNESS,
      height: 100,
    },
    fill: {
      color: 'green',
    },
  });
};
