import { setCollisionLayers } from '../../core/gameState/collisionLayers';
import { createScene } from '../../core/scene/scene';
import type { DeepPartial } from '../../core/types';
import { Screen } from '../../core/units';
import { createAnimatedView } from '../../core/view/animatedView';
import { createEnemyView } from '../../core/view/createEnemyView';
import { createPlayerView } from '../../core/view/player/playerView';
import type { View } from '../../core/view/types';

const basePlayerProps: DeepPartial<View> = {
  model: {
    score: 0,
  },
  geometry: {
    shape: 'rect',
    width: Screen.percent(1).w,
    height: Screen.percent(20).h,
    style: {
      fill: {
        color: 'white',
      },
    },
  },
  physics: {
    bounce: 0,
  },
};

export const pong = () => {
  const scene = createScene('pong');

  setCollisionLayers({
    PLAYER: ['DEFAULT', 'ENEMY'],
    ENEMY: ['DEFAULT', 'PLAYER'],
  });

  const player1 = createPlayerView(
    {
      ...basePlayerProps,
      id: 'player-1',
      geometry: {
        ...basePlayerProps.geometry,
        x: 10,
      },
    },
    {
      up: 'w',
      down: 's',
    }
  );

  const player2 = createPlayerView(
    {
      ...basePlayerProps,
      id: 'player-2',
      geometry: {
        ...basePlayerProps.geometry,
        x: Screen.w - (basePlayerProps.geometry?.width ?? 0) - 10,
      },
    },
    {
      up: 'ArrowUp',
      down: 'ArrowDown',
    }
  );

  const ball = createEnemyView({
    geometry: {
      x: Screen.center.x - (basePlayerProps.geometry?.width ?? 0) / 2,
      y: Screen.center.y - (basePlayerProps.geometry?.height ?? 0) / 2,
      style: {
        fill: {
          color: 'red',
        },
      },
    },
  });

  const scoreBoard = createAnimatedView({
    id: 'score-board',
    layer: 'UI',
    geometry: {
      x: Screen.center.x,
      y: Screen.center.y,
    },
    text: {
      text: `${player1.model.score} - ${player2.model.score}`,
      fontSize: Screen.percent(2).w,
      style: {
        fill: {
          color: 'white',
        },
      },
    },
  });

  ball.collisionHandler.addCollisionEvent((e: CustomEvent) => {
    console.log('ball collided', e);
    const collision = e.detail.collision;

    if (collision.view2.id === 'player-1') {
      player1.model.score++;
    } else if (collision.view2.id === 'player-2') {
      player2.model.score++;
    }

    scoreBoard.updateText({
      text: `${player1.model.score} - ${player2.model.score}`,
    });
  });

  return scene;
};
