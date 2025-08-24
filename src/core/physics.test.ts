import { describe, it, expect } from 'vitest';
import { createPhysics } from './physics';

describe('createPhysics', () => {
  it('should create a physics instance with correct methods', () => {
    const physics = createPhysics();

    expect(physics).toHaveProperty('applyForce');
    expect(physics).toHaveProperty('update');
    expect(physics).toHaveProperty('getCurrentForce');
    expect(physics).toHaveProperty('reset');

    expect(typeof physics.applyForce).toBe('function');
    expect(typeof physics.update).toBe('function');
    expect(typeof physics.getCurrentForce).toBe('function');
    expect(typeof physics.reset).toBe('function');
  });

  it('should apply forces correctly', () => {
    const physics = createPhysics();

    // Initial force should be zero
    expect(physics.getCurrentForce()).toEqual({ x: 0, y: 0 });

    // Apply a force
    physics.applyForce({ x: 10, y: 5 });
    expect(physics.getCurrentForce()).toEqual({ x: 10, y: 5 });

    // Apply another force (should add to existing)
    physics.applyForce({ x: 2, y: -1 });
    expect(physics.getCurrentForce()).toEqual({ x: 12, y: 4 });
  });

  it('should apply dampening correctly', () => {
    const physics = createPhysics();

    // Apply initial force
    physics.applyForce({ x: 100, y: 50 });

    // Update with default dampening (0.95)
    const force1 = physics.update();
    expect(force1).toEqual({ x: 95, y: 47.5 });

    // Update again
    const force2 = physics.update();
    expect(force2).toEqual({ x: 90.25, y: 45.125 });
  });

  it('should stop very small forces', () => {
    const physics = createPhysics();

    // Apply a small force
    physics.applyForce({ x: 0.005, y: 0.005 });

    // Update with dampening - should become zero
    const force = physics.update(0.1); // High dampening
    expect(force).toEqual({ x: 0, y: 0 });
  });

  it('should reset forces to zero', () => {
    const physics = createPhysics();

    // Apply some forces
    physics.applyForce({ x: 10, y: 20 });
    expect(physics.getCurrentForce()).toEqual({ x: 10, y: 20 });

    // Reset
    physics.reset();
    expect(physics.getCurrentForce()).toEqual({ x: 0, y: 0 });
  });

  it('should handle custom dampening values', () => {
    const physics = createPhysics();

    // Apply initial force
    physics.applyForce({ x: 100, y: 100 });

    // Update with custom dampening (0.5 = 50% reduction)
    const force = physics.update(0.5);
    expect(force).toEqual({ x: 50, y: 50 });
  });
});
