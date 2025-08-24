import type { EntityViewInstance } from '../player/entityView';

const RANDOM_SPEED = 0.4; // Same as PLAYER_SPEED

// Store direction outside the function to persist between calls
const directionMap = new Map<string, { x: number; y: number }>();

export const screenSaver = (view: EntityViewInstance, deltaTime: number) => {
  // Get current direction or initialize
  let direction = directionMap.get(view.view.props.id) || {
    x: 1,
    y: 1,
  };
  const { position, units, shapeProps } = view.view.props;

  // Calculate new position using deltaTime like the player movement
  const speedModifier = view.entity.speed + RANDOM_SPEED;
  const newX = position.x + direction.x * speedModifier;
  const newY = position.y + direction.y * speedModifier;

  // For x-axis: use viewport width boundary
  if (newX < 0 || newX > 100 - shapeProps.width * 2) {
    direction.x = -direction.x;
  }

  // For y-axis: calculate proper viewport height boundary
  // If using vw units, convert to vh equivalent for y-axis
  let yMax = 100;
  if (units === 'vw') {
    // Convert vw to vh equivalent: (window.innerHeight / window.innerWidth) * 100
    yMax = (window.innerHeight / window.innerWidth) * 100;
  }

  if (newY < 0 || newY > yMax - shapeProps.height * 2) {
    direction.y = -direction.y;
  }

  // Store the direction for next frame
  directionMap.set(view.view.props.id, direction);

  // Update the view position using the move function like the player
  view.view.move(
    { x: direction.x * RANDOM_SPEED, y: direction.y * RANDOM_SPEED },
    deltaTime
  );

  return view;
};
