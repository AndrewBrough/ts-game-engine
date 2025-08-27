import { setCollisionLayers } from '../../core/gameState/collisionLayers';
import { createScene } from '../../core/scene/scene';
import type { DeepPartial } from '../../core/types';
import { Screen } from '../../core/units';
import type { CollisionComponent } from '../../core/view/components';
import { createPlayerView } from '../../core/view/entity/playerView';
import type { View } from '../../core/view/types';
import { createWorldBoundsView } from '../../core/view/world/worldBoundsView';
import { ballView } from '../views/ballView';
import { scoreBoardView } from '../views/scoreBoardView';

const basePlayerProps: DeepPartial<View> = {
  model: {
    score: 0,
    speed: 10,
  },
  geometry: {
    shape: 'rect',
    width: Screen.percent(1).w,
    height: Screen.percent(20).h,
    style: {
      fill: {
        color: 'white',
        opacity: 0.7,
      },
      stroke: {
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

  const { leftWall, rightWall } = createWorldBoundsView();
  const player1 = createPlayerView(
    {
      ...basePlayerProps,
      id: 'player-1',
      geometry: {
        ...basePlayerProps.geometry,
        x: 20,
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
        x: Screen.w - (basePlayerProps.geometry?.width ?? 0) - 20,
      },
    },
    {
      up: 'ArrowUp',
      down: 'ArrowDown',
    }
  );

  const scoreBoard = scoreBoardView(player1, player2);
  const ball = ballView();

  const collisions = ball.getComponent<CollisionComponent>('collisions');

  if (!collisions) {
    throw new Error('Collisions component not found');
  }
  collisions.addCollisionEvent((e: CustomEvent) => {
    const collision = e.detail.collision;

    if (collision.view2.id === leftWall.id) {
      player1.model.score++;
    } else if (collision.view2.id === rightWall.id) {
      player2.model.score++;
    }

    scoreBoard.updateText({
      text: `${player1.model.score} - ${player2.model.score}`,
    });
  });

  return scene;
};
