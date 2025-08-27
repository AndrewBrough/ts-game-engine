import { createScene, type SceneInstance } from '../../core/scene/scene';
import { Screen } from '../../core/units';
import { addCollisionDamage } from '../../core/view/components/events/addCollisionDamage';
import {
  addCollisionBounce,
  addWallBounce,
} from '../../core/view/components/movement';
import { gridView } from '../../core/view/debug/gridView';
import { createEnemyView } from '../../core/view/entity/enemyView';
import { defaultEntityProps } from '../../core/view/entity/entityView';
import { createPlayerView } from '../../core/view/entity/playerView';

export const breakTheGameScene = (): SceneInstance => {
  const scene = createScene('breakTheGame');

  const grid = gridView();

  const player = createPlayerView({
    model: {
      speed: 80,
      maxSpeed: 100,
    },
    physics: {
      dampening: 0.7,
      bounce: 0.5,
    },
    geometry: {
      x: Screen.w / 2 - (defaultEntityProps.geometry?.width ?? 0) / 2,
      y: Screen.h / 2 - (defaultEntityProps.geometry?.height ?? 0) / 2,
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

  for (let i = 0; i < 500; i++) {
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
        x: randomPos.x - (defaultEntityProps.geometry?.width ?? 0) / 2,
        y: randomPos.y - (defaultEntityProps.geometry?.height ?? 0) / 2,
      },
    });
    enemy.addComponent('wallbounce', addWallBounce(enemy));
    enemy.addComponent('collisionbounce', addCollisionBounce(enemy));
    enemy.addComponent('collisiondamage', addCollisionDamage(enemy));
  }

  return scene;
};
