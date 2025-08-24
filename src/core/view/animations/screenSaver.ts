import type { EntityViewInstance } from '../player/entityView';

// Store direction outside the function to persist between calls
const directionMap = new Map<string, { x: number; y: number }>();

export const screenSaver = (view: EntityViewInstance, deltaTime: number) => {
  // Get current direction or initialize
  const direction = directionMap.get(view.props.id) || {
    x: 1,
    y: 1,
  };
  const { position, geometry } = view.props;

  // Calculate new position using deltaTime like the player movement
  const newX = position.x + direction.x * deltaTime * view.model.speed;
  const newY = position.y + direction.y * deltaTime * view.model.speed;
  // For y-axis: calculate proper viewport height boundary
  // If using vw units, convert to vh equivalent for y-axis
  const xMax = 100 - geometry.width / 2;
  const yMax = 100 - geometry.height * 2;
  console.log(newX, newY, xMax, yMax);

  // For x-axis: use viewport width boundary
  if (newX <= -geometry.width / 2 || newX > xMax) {
    direction.x = -direction.x;
  }

  if (newY <= -geometry.height / 2 || newY > yMax) {
    direction.y = -direction.y;
  }

  // Store the direction for next frame
  directionMap.set(view.props.id, direction);

  // Apply force using physics system with stronger force to overcome dampening
  const force = {
    x: direction.x * deltaTime * view.model.speed,
    y: direction.y * deltaTime * view.model.speed,
  };

  view.physics.applyForce(force);

  return view;
};
