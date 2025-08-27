import type { ViewInstance } from '../../core/view/view';

export const givePoint = (player: ViewInstance) => {
  player.model.points += 1;
};
