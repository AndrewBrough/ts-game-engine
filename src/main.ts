import { createCanvas } from './core/canvas/canvas';
import { createView } from './core/view/view';

import { getState } from './core/state/state';
import { bindMouse } from './core/input/mouse';

window.onload = () => {
  createCanvas('app');
  bindMouse();
  
  createView({
    position: {
      x: 1,
      y: 1,
    },
    textProps: {
      text: getState().score,
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
