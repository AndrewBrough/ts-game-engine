import { createScene, type SceneInstance } from '../../core/scene/scene';
import { Screen } from '../../core/units';
import { createEnemyView } from '../../core/view/createEnemyView';
import { createPlayerView } from '../../core/view/player/playerView';

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

  for (let i = 0; i < 10; i++) {
    const randomPos = {
      x: Math.random() * Screen.w,
      y: Math.random() * Screen.h,
    };
    createEnemyView({
      geometry: {
        x: randomPos.x,
        y: randomPos.y,
        style: {
          fill: {
            color: 'white',
            opacity: 0.2,
          },
          stroke: {
            color: 'white',
            opacity: 1,
          },
        },
      },
    });
  }

  return scene;
};
