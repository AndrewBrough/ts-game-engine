import type { ViewInstance } from '../../core/view/view';
import { addPaddleFlash } from '../views/components/addPaddleFlash';

export const givePoint = (player: ViewInstance) => {
  player.model.score += 1;

  if (!player.hasComponent('flashPaddle')) {
    player.addComponent('flashPaddle', addPaddleFlash(player));
  } else {
    player.getComponent('flashPaddle')?.play();
  }

  console.log('givePoint', player.model.score);
};
