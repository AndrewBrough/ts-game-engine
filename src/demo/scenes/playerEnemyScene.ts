import { Screen } from '../../core/units';
import { createEnemyView } from '../../core/view/entity/enemyView';
import { createPlayerView } from '../../core/view/entity/playerView';
import { createScene } from '../../core/scene/scene';

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
