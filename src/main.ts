import { createCanvas } from './core/canvas/canvas';
import { createModel } from './core/model/model';
import { createView } from './core/view/view';

window.onload = () => {
  createCanvas('app');

  const testModel = createModel({ score: 999 });

  createView({
    position: {
      x: 1,
      y: 1,
    },
    textProps: {
      text: testModel.score,
    },
  });

  createView({
    position: { x: 1, y: 1 },
    relativeTo: 'top-right',
    textProps: {
      text: "Hello World",
    },
  });
  createView({
    position: { x: 1, y: 1 },
    relativeTo: 'bottom-left',
    fill: {
      color: 'red',
    },
    textProps: {
      text: "Hello World",
    },
  });
  createView({
    position: { x: 1, y: 1 },
    relativeTo: 'bottom-right',
    fill: {
      color: 'blue',
    },
    textProps: {
      text: "Hello World",
    },
  });

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
