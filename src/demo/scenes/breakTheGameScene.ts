import { createScene, type SceneInstance } from '../../core/scene/scene';
import { Screen } from '../../core/units';
import { createEnemyView } from '../../core/view/createEnemyView';
import { createPlayerView } from '../../core/view/player/playerView';

export const breakTheGameScene = (): SceneInstance => {
  const scene = createScene('breakTheGame');

  const player = createPlayerView({
    physics: {
      bounce: 1,
    },
    geometry: {
      width: 10,
      height: 10,
      style: {
        fill: {
          color: 'blue',
        },
      },
    },
  });

  for (let i = 0; i < 500; i++) {
    const randomPos = {
      x: Math.random() * Screen.w,
      y: Math.random() * Screen.h,
    };
    const enemy = createEnemyView();
    enemy.updatePosition(randomPos);
  }

  return scene;
};
