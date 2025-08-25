import { Screen } from '../units';
import { alwaysMoveForward } from './animations/alwaysMoveForward';
import { bounceOffWalls } from './animations/bounceOffWalls';
import { screenSaver } from './animations/screenSaver';
import { createEntityView } from './player/entityView';

export const createEnemyView = (id?: string) => {
  // Use provided id or generate a unique one
  const cubeId = id || `demoCube-${crypto.randomUUID()}`;

  const entityView = createEntityView({
    id: cubeId,
    geometry: {
      shape: 'rect',
      style: {
        fill: {
          color: 'red',
        },
        stroke: {
          color: 'red',
          opacity: 1,
          width: 2,
        },
      },
    },
    text: {
      text: 'Enemy',
      fontSize: Screen.percent(3).w,
      offset: 'center',
      style: {
        fill: {
          color: 'black',
          opacity: 1,
        },
        stroke: {
          color: 'white',
          opacity: 1,
          width: 1,
        },
      },
    },
  });

  entityView.updatePosition({
    x: Math.random() * Screen.w,
    y: Math.random() * Screen.h,
  });

  // screenSaver(entityView);
  // alwaysMoveForward(entityView);
  bounceOffWalls(entityView);

  return entityView;
};
