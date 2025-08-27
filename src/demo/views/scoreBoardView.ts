import { Screen } from '../../core/units';
import { addAnimations } from '../../core/view/components/addAnimations';
import type { EntityViewInstance } from '../../core/view/entity/entityView';
import { createView } from '../../core/view/view';

export const scoreBoardView = (
  player1: EntityViewInstance,
  player2: EntityViewInstance
) => {
  const scoreBoard = createView({
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

  addAnimations(scoreBoard);

  return scoreBoard;
};
