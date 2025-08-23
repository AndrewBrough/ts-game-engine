import { createCanvas } from './core/canvas/canvas';

import { bindMouse } from './core/input/mouse';
import { createLoop } from './core/loop/loop';
import { createAnimatedView } from './core/view/animatedView';

window.onload = () => {
  createCanvas('app');
  bindMouse();
  createLoop();
  
  createAnimatedView({
    position: {
      x: 1,
      y: 1,
    },
    shape: 'rect',
    shapeProps: {
      width: 5,
      height: 5,
      radius: 0,
    },
    fill: {
      color: 'red',
    },
    stroke: {
      color: 'blue',
      width: 2,
    },
    textProps: {
      text: 'Hello',
      fontSize: 16,
      fontFamily: 'Arial',
      fontWeight: 'normal',
      fontStyle: 'normal',
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
