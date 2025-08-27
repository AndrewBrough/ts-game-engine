import { Screen } from '../../core/units';
import { createEnemyView } from '../../core/view/entity/enemyView';
import boltSvg from '../assets/bolt.svg';

export const ballView = () => {
  const ball = createEnemyView({
    model: {
      speed: 5,
    },
    imageUrl: boltSvg,
    geometry: {
      shape: 'image',
      x: Screen.center.x - Screen.percent(5).w / 2,
      y: Screen.center.y - Screen.percent(5).w / 2,
      width: Screen.percent(5).w,
      height: Screen.percent(5).w,
      style: {
        fill: {
          color: 'cornflowerblue',
          opacity: 1,
        },
        stroke: {
          color: 'white',
          opacity: 1,
        },
      },
    },
  });

  return ball;
};
