import { setCollisionLayers } from '../../core/gameState/collisionLayers';
import { createScene } from '../../core/scene/scene';
import type { DeepPartial } from '../../core/types';
import { Screen } from '../../core/units';
import type { CollisionComponent } from '../../core/view/components';
import { createPlayerView } from '../../core/view/entity/playerView';
import type { View } from '../../core/view/types';
import { createWorldBoundsView } from '../../core/view/world/worldBoundsView';
import { givePoint } from '../scripts/points';
import { ballView } from '../views/ballView';
import { basePlayerProps } from '../views/playerPaddleView';
import { scoreBoardView } from '../views/scoreBoardView';

export const pong = () => {
  const scene = createScene('pong');

  setCollisionLayers({
    PLAYER: ['DEFAULT', 'ENEMY'],
    ENEMY: ['DEFAULT', 'PLAYER'],
  });

  const { leftWall, rightWall } = createWorldBoundsView();

  // slow the ball when it hits a back wall
  leftWall.model.collisionDamage = 1;
  rightWall.model.collisionDamage = 1;

  const player1 = createPlayerView(
    {
      ...basePlayerProps,
      id: 'player-1',
      geometry: {
        ...basePlayerProps.geometry,
        x: 20,
        style: {
          ...basePlayerProps.geometry?.style,
          fill: {
            color: 'red',
          },
          stroke: {
            color: 'red',
            opacity: 1,
          },
        },
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
        style: {
          fill: {
            color: 'blue',
          },
          stroke: {
            color: 'blue',
            opacity: 1,
          },
        },
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
      givePoint(player1);
    } else if (collision.view2.id === rightWall.id) {
      givePoint(player2);
    }

    scoreBoard.updateText({
      text: `${player1.model.score} - ${player2.model.score}`,
    });

    ball.model.speed = Math.max(Math.min(ball.model.health, 10), 5);
  });

  return scene;
};
