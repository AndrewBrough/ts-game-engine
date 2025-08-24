import type { AnimatedViewInstance } from '../animatedView';

const CUBE_SPEED = 0.5; // Same as PLAYER_SPEED

// Store direction outside the function to persist between calls
const directionMap = new Map<string, { x: number; y: number }>();

export const screenSaver = (
  viewInstance: AnimatedViewInstance,
  deltaTime: number
) => {
  // Get current direction or initialize
  let direction = directionMap.get(viewInstance.props.id) || { x: 1, y: 1 };
  const { position, units, shapeProps } = viewInstance.props;

  // Calculate new position using deltaTime like the player movement
  const newX = position.x + direction.x * CUBE_SPEED * (deltaTime / 10);
  const newY = position.y + direction.y * CUBE_SPEED * (deltaTime / 10);

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
  directionMap.set(viewInstance.props.id, direction);

  // Update the view position using the move function like the player
  viewInstance.move(
    { x: direction.x * CUBE_SPEED, y: direction.y * CUBE_SPEED },
    deltaTime
  );

  return viewInstance;
};
