import { Screen } from '../units';
import { createEnemyView } from '../view/createEnemyView';
import { createPlayerView } from '../view/player/playerView';
import { createScene } from './scene';

export const demoScene = () => {
  const scene = createScene('demo');

  // createWorldBoundsView();
  const player = createPlayerView();
  createEnemyView();

  player.updatePosition({
    x: Screen.center.x - player.geometry.width / 2,
    y: Screen.center.y - player.geometry.height / 2,
  });

  return scene;
};
