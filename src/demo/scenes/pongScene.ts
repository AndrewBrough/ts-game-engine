import { setCollisionLayers } from '../../core/gameState/collisionLayers';
import type { Collision } from '../../core/gameState/collisionManager';
import { createScene } from '../../core/scene/scene';
import type { CollisionComponent } from '../../core/view/components';
import { gridView } from '../../core/view/debug/gridView';
import { createWorldBoundsView } from '../../core/view/world/worldBoundsView';
import { ballView } from '../views/ballView';
import { basePlayerProps, playerPaddleView } from '../views/playerPaddleView';
import { scoreBoardView } from '../views/scoreBoardView';

export const pongScene = () => {
  const scene = createScene('pong');

  setCollisionLayers({
    PLAYER: ['DEFAULT', 'ENEMY'],
    ENEMY: ['DEFAULT', 'PLAYER'],
  });

  gridView();

  const { leftWall, rightWall } = createWorldBoundsView();

  // slow the ball when it hits a back wall
  leftWall.model.collisionDamage = 1;
  rightWall.model.collisionDamage = 1;

  const player1 = playerPaddleView(
    {
      ...basePlayerProps,
      id: 'player-1',
      geometry: {
        ...basePlayerProps.geometry,
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
    },
    'left'
  );

  const player2 = playerPaddleView(
    {
      ...basePlayerProps,
      id: 'player-2',
      geometry: {
        ...basePlayerProps.geometry,
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
    },
    'right'
  );

  const scoreBoard = scoreBoardView(player1, player2);
  const ball = ballView();

  const ballCollisions = ball.getComponent<CollisionComponent>('collisions');

  if (!ballCollisions) {
    throw new Error('Collisions component not found');
  }
  ballCollisions.addCollisionEvent(
    (e: CustomEvent<{ collision: Collision }>) => {
      const collision = e.detail.collision;

      if (collision.view2.id === leftWall.id) {
        player2.givePoint(1);
        player1.flashPaddle();
      } else if (collision.view2.id === rightWall.id) {
        player1.givePoint(1);
        player2.flashPaddle();
      }

      scoreBoard.updateText({
        text: `${player1.model.score} - ${player2.model.score}`,
      });

      ball.model.speed = Math.max(Math.min(ball.model.health, 10), 5);
    }
  );

  return scene;
};
