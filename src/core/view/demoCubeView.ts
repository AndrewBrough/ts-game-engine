import { screenSaver } from './animations/screenSaver';
import { createAnimatedView } from './animatedView';

export const createDemoCubeView = (id?: string) => {
  // Generate random positions between 0-100
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;

  // Use provided id or generate a unique one
  const cubeId = id || `demoCube-${Math.random().toString(36).substr(2, 9)}`;

  const animatedView = createAnimatedView({
    id: cubeId,
    layer: 'DEFAULT',
    position: {
      x: randomX,
      y: randomY,
    },
    shapeProps: {
      width: 10,
      height: 10,
    },
    shape: 'rect',
    fill: {
      color: 'red',
    },
  });

  animatedView.events.addEvent('update', (e: CustomEvent) => {
    screenSaver(animatedView, e.detail.deltaTime ?? 16);
  });

  animatedView.addAnimation(() => {}, 'update');

  return animatedView;
};
