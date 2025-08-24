import type { EntityViewInstance } from '../player/entityView';

export const screenSaver = (entityView: EntityViewInstance) => {
  const randomSpeed = () => Math.random() * 10 + entityView.model.speed;
  const constantForce = { x: randomSpeed(), y: randomSpeed() };

  entityView.events.addEvent('update', (e: CustomEvent) => {
    if (
      entityView.props.position.x <= 0 ||
      entityView.props.position.x >= 100
    ) {
      entityView.physics.reset();
      constantForce.x *= -1;
    }
    if (
      entityView.props.position.y <= 0 ||
      entityView.props.position.y >= 100
    ) {
      entityView.physics.reset();
      constantForce.y *= -1;
    }
    console.log(constantForce);
    entityView.physics.applyForce(constantForce);
  });
};
