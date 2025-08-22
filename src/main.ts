import { createCanvas } from './core/canvas/canvas';
import { createModel } from './core/model/model';
import { createView } from './core/view/view';

window.onload = () => {
  createCanvas('app');

  const testModel = createModel({ score: 999 });

  createView({
    position: {
      x: 0,
      y: 0,
    },
    shape: 'text',
    textProps: {
      text: testModel.score,
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
