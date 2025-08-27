import { Screen } from '../../core/units';
import { addCollisionDamage } from '../../core/view/components/events/addCollisionDamage';
import { addCollisionBounce } from '../../core/view/components/movement';
import { createEnemyView } from '../../core/view/entity/enemyView';
import boltSvg from '../assets/bolt.svg';

export const ballView = () => {
  const view = createEnemyView({
    model: {
      health: 5,
      speed: 5,
      collisionDamage: 0, // ball does not damage anything
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

  // view.addComponent('wallBounce', addWallBounce(view));
  view.addComponent('collisionBounce', addCollisionBounce(view));
  view.addComponent('collisionDamage', addCollisionDamage(view));

  return view;
};
