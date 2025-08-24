import type { Collision } from '../gameState/collisionManager';
import type { DeepPartial } from '../types';
import type { InteractiveView, Position } from './types';
import { createView } from './view';

export type AnimatedViewInstance = ReturnType<typeof createAnimatedView>;

export const createAnimatedView = (
  props: DeepPartial<InteractiveView> = {}
) => {
  const viewInstance = createView(props);

  const animate = () => {
    viewInstance.update();
  };

  const move = (position: Position, deltaTime: number) => {
    viewInstance.updatePosition({
      x: viewInstance.props.position.x + (position.x * deltaTime) / 10,
      y: viewInstance.props.position.y + (position.y * deltaTime) / 10,
    });
  };

  const addAnimation = (
    callback: (e: CustomEvent) => void,
    event: 'animate' | 'update' | 'render' = 'animate'
  ) => {
    viewInstance.events.addEvent(event, callback);
  };

  addAnimation((e: CustomEvent) => {
    animate();
  });

  const handleCollide = (e: CustomEvent<{ collision: Collision }>) => {
    const collision = e.detail?.collision;
    const otherView =
      collision.view1.id === viewInstance.props.id
        ? collision.view2
        : collision.view1;

    console.log(
      `I am ${viewInstance.props.id} and I collided with ${otherView.id}`
    );
  };

  if (viewInstance.props.layer === 'PLAYER') {
    viewInstance.events.addEvent('collide', handleCollide);
  }

  return {
    ...viewInstance,
    addAnimation,
    animate,
    move,
    handleCollide,
  };
};
