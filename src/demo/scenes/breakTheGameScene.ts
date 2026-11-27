import { createScene, type SceneInstance } from '../../core/scene/scene';
import { Screen } from '../../core/units';
import { addCollisionDamage } from '../../core/view/components/events/addCollisionDamage';
import {
  addCollisionBounce,
  addWallBounce,
} from '../../core/view/components/movement';
import { gridView } from '../../core/view/debug/gridView';
import { defaultEntityProps } from '../../core/view/entity/entityView';
import { createPlayerView } from '../../core/view/entity/playerView';
import { spawnBouncingEnemies } from '../views/bouncingEnemyView';
import { cubeCountView } from '../views/cubeCountView';
import { PAUSE_KEYS } from '../views/pauseButton';
import { createSpawnButton } from '../views/spawnButton';

const INITIAL_ENEMIES = 50;

export const breakTheGameScene = (): SceneInstance => {
  const scene = createScene('breakTheGame', {
    // Space spawns enemies in this scene, so take it off the pause button
    pauseButton: { hotkeys: PAUSE_KEYS.filter(key => key !== ' ') },
  });

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

  // Bottom-left counter; updates itself whenever a cube is added
  cubeCountView();

  spawnBouncingEnemies(INITIAL_ENEMIES);

  // Bottom-right button; Space also triggers it
  createSpawnButton(spawnBouncingEnemies, {
    count: 50,
    initialTotal: INITIAL_ENEMIES,
  });

  return scene;
};
