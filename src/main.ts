import { createCanvas } from './core/canvas/canvas';

import { bindMouse } from './core/input/mouse';
import { createLoop } from './core/loop/loop';
import { createAnimatedView } from './core/view/animatedView';

window.onload = () => {
  createCanvas('app');
  bindMouse();
  createLoop();
  
  createAnimatedView({
    anchor: 'bottom-left',
    shape: 'rect',
    shapeProps: {
      width: 100,
      height: 100,
    },
    fill: {
      color: 'red',
    },
  });

  // createView({
  //   position: { x: 1, y: 1 },
  //   relativeTo: 'top-right',
  //   textProps: {
  //     text: "Hello World",
  //   },
  // });
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
