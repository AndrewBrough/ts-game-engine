import { createScene, type SceneInstance } from '../../core/scene/scene';
import { Screen } from '../../core/units';
import { addCollisionDamage } from '../../core/view/components/events/addCollisionDamage';
import {
  addCollisionBounce,
  addWallBounce,
} from '../../core/view/components/movement';
import { addHealthOpacityStyle } from '../../core/view/components/styles/addHealthOpacityStyle';
import { createEnemyView } from '../../core/view/entity/enemyView';
import { createPlayerView } from '../../core/view/entity/playerView';

export const breakTheGameScene = (): SceneInstance => {
  const scene = createScene('breakTheGame');

  const player = createPlayerView({
    model: {
      speed: 25,
    },
    physics: {
      bounce: 0.5,
    },
    geometry: {
      style: {
        fill: {
          color: 'blue',
        },
      },
    },
  });

  player.addComponent('wallbounce', addWallBounce(player));
  player.addComponent('collisionbounce', addCollisionBounce(player));
  player.addComponent('collisiondamage', addCollisionDamage(player));
  player.addComponent('healthopacitystyle', addHealthOpacityStyle(player));

  for (let i = 0; i < 200; i++) {
    const randomPos = {
      x: Math.random() * Screen.w,
      y: Math.random() * Screen.h,
    };
    const enemy = createEnemyView({
      model: {
        speed: 5,
        collisionDamage: 10,
      },
      geometry: {
        x: randomPos.x,
        y: randomPos.y,
      },
    });
    enemy.addComponent('wallbounce', addWallBounce(enemy));
    enemy.addComponent('collisionbounce', addCollisionBounce(enemy));
    enemy.addComponent('collisiondamage', addCollisionDamage(enemy));
    enemy.addComponent('healthOpacityStyle', addHealthOpacityStyle(enemy));
  }

  return scene;
};
