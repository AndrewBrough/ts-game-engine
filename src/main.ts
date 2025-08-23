import { createCanvas } from './core/canvas/canvas';

import { bindMouse } from './core/input/mouse';
import { createLoop } from './core/loop/loop';
import { createFpsView } from './core/loop/fpsView';
import { createDemoCubeView } from './core/view/demoCubeView';
import { createPauseButton } from './core/view/pauseButton';

window.onload = () => {
  createCanvas('app');
  bindMouse();
  createLoop();
  
  // createDemoCubeView();
  // createFpsView();
  
  // createPauseButton({
  //   position: {
  //     x: 1,
  //     y: 10,
  //   },
  //   textProps: {
  //     text: 'Animation Pause',
  //   },
  // }, 'animation');

  // createPauseButton({
  //   relativeTo: 'top-left',
  // }, 'both');
  createPauseButton({
    relativeTo: 'top-left',
  }, 'both');
  createPauseButton({ 
    relativeTo: 'top-right',
  }, 'both');
  createPauseButton({
    relativeTo: 'bottom-left',
  }, 'both');
  createPauseButton({
    relativeTo: 'bottom-right',
  }, 'both');

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
