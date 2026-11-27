import { Screen } from '../../core/units';
import { addLayout } from '../../core/view/components/addLayout';
import { createView, type ViewInstance } from '../../core/view/view';

export const scoreBoardView = (
  player1: ViewInstance,
  player2: ViewInstance
) => {
  const view = createView({
    id: 'score-board',
    layer: 'UI',
    text: {
      align: 'center',
      verticalAlign: 'center',
      text: `${player1.model.score} - ${player2.model.score}`,
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

  // Centred, re-run on resize
  view.addComponent(
    'layout',
    addLayout(view, () => ({
      x: Screen.center.x,
      y: Screen.center.y,
      fontSize: Screen.percent(5).w,
    }))
  );

  return view;
};
