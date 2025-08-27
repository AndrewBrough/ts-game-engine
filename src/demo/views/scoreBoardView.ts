import { Screen } from '../../core/units';
import { addAnimations } from '../../core/view/components/addAnimations';
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
      offset: 'center',
      text: `${player1.model.score} - ${player2.model.score}`,
      fontSize: Screen.percent(2).w,
      style: {
        fill: {
          color: 'white',
        },
      },
    },
  });

  return view;
};
