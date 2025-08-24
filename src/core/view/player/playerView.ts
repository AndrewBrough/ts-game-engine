import type { Collision } from '../../gameState/collisionManager';
import { isKeyHeld } from '../../input/keyboard';
import type { EntityModel, Position } from '../types';
import { createEntityView } from './entityView';

const startPlayerModel: EntityModel = {
  speed: 1,
  health: 100,
};

export const createPlayerView = () => {
  const view = createEntityView({
    id: 'player',
    model: { ...startPlayerModel },
    layer: 'PLAYER',
    relativeTo: 'top-left',
    shapeProps: {
      width: 10,
      height: 10,
    },
    shape: 'rect',
    fill: {
      color: 'blue',
    },
    stroke: {
      color: 'transparent',
      width: 0,
      opacity: 0,
    },
  });

  view.events.addEvent('update', (e: CustomEvent) => {
    const deltaTime = e.detail?.deltaTime || 16; // Default to 16ms (60fps)

    const movement: Position = {
      x: 0,
      y: 0,
    };
    const speed = (view.model as EntityModel).speed;

    if (isKeyHeld('a') || isKeyHeld('ArrowLeft')) {
      movement.x = -speed;
    }
    if (isKeyHeld('d') || isKeyHeld('ArrowRight')) {
      movement.x = speed;
    }
    if (isKeyHeld('w') || isKeyHeld('ArrowUp')) {
      movement.y = -speed;
    }
    if (isKeyHeld('s') || isKeyHeld('ArrowDown')) {
      movement.y = speed;
    }

    view.move(movement, deltaTime);
  });

  const playerCollide = (e: CustomEvent<{ collision: Collision }>) => {
    const collision = e.detail?.collision;
    const thisView =
      collision.view1.id === view.props.id ? collision.view1 : collision.view2;
    const otherView =
      collision.view1.id === view.props.id ? collision.view2 : collision.view1;

    // calc damage and apply health changes
    if (otherView.model && 'health' in otherView.model) {
      const damage = (otherView.model as EntityModel).health;
      const currentHealth = (view.model as EntityModel).health;
      const newHealth = currentHealth - damage;

      (view.model as EntityModel).health = newHealth;

      const percentHealth =
        (view.model as EntityModel).health / startPlayerModel.health;
      console.log(currentHealth, damage, newHealth, percentHealth);
      const opacity = Math.max(0, percentHealth);
      view.updateFillColor({
        color: view.fill.color,
        opacity,
      });
      view.updateStrokeColor({
        color: view.stroke.color,
        opacity,
      });
      view.update();
    }
  };

  view.events.addEvent('collide', playerCollide);

  return view;
};
