import type { ViewInstance } from '../view';
import type { ComponentName } from './component';

// Example of how to use the new component system

// Define specific component types for better type safety
export interface PhysicsComponent {
  velocity: { x: number; y: number };
  acceleration: { x: number; y: number };
  mass: number;
}

export interface AnimationComponent {
  currentFrame: number;
  totalFrames: number;
  frameRate: number;
  isPlaying: boolean;
}

// Example usage functions
export const addPhysicsToView = (view: ViewInstance) => {
  const physicsComponent: PhysicsComponent = {
    velocity: { x: 0, y: 0 },
    acceleration: { x: 0, y: 0 },
    mass: 1,
  };

  view.addComponent('physics', physicsComponent);
};

export const addAnimationToView = (view: ViewInstance) => {
  const animationComponent: AnimationComponent = {
    currentFrame: 0,
    totalFrames: 10,
    frameRate: 60,
    isPlaying: false,
  };

  view.addComponent('animations', animationComponent);
};

// Type-safe component retrieval
export const getPhysicsComponent = (
  view: ViewInstance
): PhysicsComponent | undefined => {
  return view.getComponent<PhysicsComponent>('physics');
};

export const getAnimationComponent = (
  view: ViewInstance
): AnimationComponent | undefined => {
  return view.getComponent<AnimationComponent>('animations');
};

// Example of checking if a view has a component
export const updatePhysics = (view: ViewInstance) => {
  if (view.hasComponent('physics')) {
    const physics = getPhysicsComponent(view);
    if (physics) {
      // Update physics logic
      physics.velocity.x += physics.acceleration.x;
      physics.velocity.y += physics.acceleration.y;
    }
  }
};
