import { Screen } from '../../core/units';
import { createView, type ViewInstance } from '../../core/view/view';

export const scoreBoardView = (
  player1: ViewInstance,
  player2: ViewInstance
) => {
  const view = createView({
    id: 'score-board',
    layer: 'UI',
    geometry: {
      x: Screen.center.x,
      y: Screen.center.y,
    },
    text: {
      align: 'center',
      verticalAlign: 'center',
      text: `${player1.model.score} - ${player2.model.score}`,
      fontSize: Screen.percent(5).w,
      style: {
        fill: {
          color: 'white',
        },
        stroke: {
          color: 'white',
          width: 1,
          opacity: 1,
        },
      },
    },
  });

  return view;
};
