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
    units: 'vh',
    anchor: 'top-left',
    shape: 'text',
    stroke: {
      color: 'red',
    },
    textProps: {
      text: testModel.score,
      fontSize: 3,
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
