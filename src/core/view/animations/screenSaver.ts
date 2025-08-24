import type { EntityViewInstance } from '../player/entityView';

// Store direction outside the function to persist between calls
const directionMap = new Map<string, { x: number; y: number }>();

export const screenSaver = (view: EntityViewInstance, deltaTime: number) => {
  // Get current direction or initialize
  let direction = directionMap.get(view.props.id) || {
    x: 1,
    y: 1,
  };
  const { position, units, shapeProps } = view.props;

  // Calculate new position using deltaTime like the player movement
  const newX = position.x + direction.x * deltaTime * view.model.speed;
  const newY = position.y + direction.y * deltaTime * view.model.speed;
  // For y-axis: calculate proper viewport height boundary
  // If using vw units, convert to vh equivalent for y-axis
  let yMax = 100;
  let xMax = 100;
  if (units === 'vw') {
    // Convert vw to vh equivalent: (window.innerHeight / window.innerWidth) * 100
    yMax = (window.innerHeight / window.innerWidth) * 100;
  }
  if (units === 'vh') {
    xMax = (window.innerWidth / window.innerHeight) * 100;
  }

  // For x-axis: use viewport width boundary
  if (newX <= -shapeProps.width / 1.5 || newX > xMax - shapeProps.width * 2) {
    direction.x = -direction.x;
  }

  if (newY <= -shapeProps.height / 1.5 || newY > yMax - shapeProps.height) {
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
