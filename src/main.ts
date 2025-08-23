import { createCanvas } from './core/canvas/canvas';

import { bindMouse } from './core/input/mouse';
import { createLoop } from './core/loop/loop';
import { createFpsView } from './core/loop/fpsView';
import { createDemoCubeView } from './core/view/demoCubeView';
import { createAnimatedView } from './core/view/animatedView';

window.onload = () => {
  createCanvas('app');
  bindMouse();
  createLoop();
  
  createDemoCubeView();
  createFpsView();

  // Create static text display
  createAnimatedView({
    id: 'test-hilo-text-view',
    position: { x: 1, y: 10 },
    relativeTo: 'top-right',
    anchor: 'top-right',
    shape: 'text',
    textProps: {
      text: 'Hilo',
      fontFamily: 'Arial',
      fontWeight: 'bold',
      fontStyle: 'normal',
    },
    fill: {
      color: 'white',
    },
  });
  // createView({
  //   position: { x: 1, y: 1 },
  //   relativeTo: 'bottom-left',
  //   fill: {
  //     color: 'red',
  //   },
  //   textProps: {
  //     text: "Hello World",
  //   },
  // });
  // createView({
  //   position: { x: 1, y: 1 },
  //   relativeTo: 'bottom-right',
  //   fill: {
  //     color: 'blue',
  //   },
  //   textProps: {
  //     text: "Hello World",
  //   },
  // });

  // createView({
  //   position: {
  //       x: 100,
  //       y: 100,
  //   },
  //   shape: 'rect',
  //   shapeProps: {
  //       width: 100,
  //       height: 100,
  //   },
  // });
};
