import { Screen } from '../../core/units';
import { createEnemyView } from '../../core/view/entity/enemyView';
import { createPlayerView } from '../../core/view/entity/playerView';
import { createScene } from '../../core/scene/scene';
import { gridView } from '../../core/view/debug/gridView';
import {
  addCollisionBounce,
  addWallBounce,
} from '../../core/view/components/movement';

export const demoScene = () => {
  const scene = createScene('demo');

  const grid = gridView();

  // createWorldBoundsView();
  const player = createPlayerView({
    model: {
      speed: 50,
      maxSpeed: 100,
    },
    physics: {
      dampening: 0.7,
    },
  });
  player.addComponent('wallBounce', addWallBounce(player));
  player.addComponent('collisionBounce', addCollisionBounce(player));

  const enemy = createEnemyView();
  enemy.addComponent('wallBounce', addWallBounce(enemy));
  enemy.addComponent('collisionBounce', addCollisionBounce(enemy));

  player.updatePosition({
    x: Screen.center.x - player.geometry.width / 2,
    y: Screen.center.y - player.geometry.height / 2,
  });

  return scene;
};
