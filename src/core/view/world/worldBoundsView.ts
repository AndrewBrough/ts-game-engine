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
    geometry: {
      ...baseProps.geometry,
      width: WALL_THICKNESS,
      height: 100,
    },
    fill: {
      color: 'green',
    },
  });

  // createPauseButton({
  //   relativeTo: 'bottom-right',
  //   position: {
  //     x: -5,
  //     y: -5,
  //   },
  //   shapeProps: {
  //     width: 5,
  //     height: 5,
  //   },
  // });

  // Bottom wall
  //   createWall({
  //     id: 'bottom-wall',
  //     model: {
  //       health: 'bottom',
  //       speed: 0,
  //       collisionDamage: 0,
  //     },
  //     relativeTo: 'bottom-left',
  //     position: {
  //       x: 0,
  //       y: 80,
  //     },
  //     shapeProps: {
  //       width: 100,
  //       height: WALL_THICKNESS,
  //     },
  //     fill: {
  //       color: 'red',
  //       opacity: 0.7,
  //     },
  //     stroke: {
  //       color: 'black',
  //       opacity: 1,
  //     },
  //   });
  //   console.log(getState().views);

  //   // Left wall
  //   createWall({
  //     model: {
  //       health: 'left',
  //     },
  //     position: {
  //       x: WALL_THICKNESS / 2,
  //       y: 0,
  //     },
  //   });

  //   // Right wall
  //   createWall({
  //     model: {
  //       health: 'right',
  //     },
  //     position: {
  //       x: window.innerWidth - WALL_THICKNESS / 2,
  //       y: 0,
  //     },
  //   });
};
