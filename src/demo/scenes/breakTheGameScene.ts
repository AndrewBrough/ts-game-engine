import { createScene, type SceneInstance } from '../../core/scene/scene';
import { Screen } from '../../core/units';
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

  for (let i = 0; i < 50; i++) {
    const randomPos = {
      x: Math.random() * Screen.w,
      y: Math.random() * Screen.h,
    };
    const enemy = createEnemyView({
      model: {
        speed: 5,
      },
      geometry: {
        x: randomPos.x,
        y: randomPos.y,
      },
    });
    enemy.addComponent('healthOpacityStyle', addHealthOpacityStyle(enemy));
  }

  return scene;
};
