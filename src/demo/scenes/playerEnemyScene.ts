import { createScene } from '../../core/scene/scene';
import { Screen } from '../../core/units';
import { addCollisionDamage } from '../../core/view/components/events/addCollisionDamage';
import {
  addCollisionBounce,
  addWallBounce,
} from '../../core/view/components/movement';
import { addHealthOpacityStyle } from '../../core/view/components/styles/addHealthOpacityStyle';
import { gridView } from '../../core/view/debug/gridView';
import { createEnemyView } from '../../core/view/entity/enemyView';
import { createPlayerView } from '../../core/view/entity/playerView';

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
    geometry: {
      shape: 'circle',
      width: Math.min(Screen.percent(7.5).w, 50),
      height: Math.min(Screen.percent(7.5).w, 50),
    },
  });
  player.addComponent('wallBounce', addWallBounce(player));
  player.addComponent('collisionBounce', addCollisionBounce(player));
  player.addComponent('collisionDamage', addCollisionDamage(player));
  player.addComponent('healthopacitystyle', addHealthOpacityStyle(player));

  const enemy = createEnemyView();
  enemy.addComponent('wallBounce', addWallBounce(enemy));
  enemy.addComponent('collisionBounce', addCollisionBounce(enemy));
  enemy.addComponent('collisionDamage', addCollisionDamage(enemy));
  enemy.addComponent('healthopacitystyle', addHealthOpacityStyle(enemy));

  player.updatePosition({
    x: Screen.center.x - player.geometry.width / 2,
    y: Screen.center.y - player.geometry.height / 2,
  });

  return scene;
};
