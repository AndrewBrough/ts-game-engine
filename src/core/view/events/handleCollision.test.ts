import { describe, it, expect, vi } from 'vitest';
import { createCollisionHandler } from './handleCollision';
import { createPhysics } from '../../physics';
import type { Collision } from '../../gameState/collisionManager';
import type { View } from '../types';

describe('createCollisionHandler', () => {
  it('should create a collision handler with correct methods', () => {
    const mockView = {
      props: { id: 'test-view', layer: 'PLAYER' },
      model: { health: 100 },
      events: {
        addEvent: vi.fn(),
        removeEvent: vi.fn(),
      },
      updateFillColor: vi.fn(),
    };
    const physics = createPhysics();
    const initialModel = { health: 100, speed: 1, collisionDamage: 10 };

    const handler = createCollisionHandler(mockView, physics, initialModel);

    expect(handler).toHaveProperty('handleCollide');
    expect(handler).toHaveProperty('attachCollisionHandler');
    expect(handler).toHaveProperty('detachCollisionHandler');

    expect(typeof handler.handleCollide).toBe('function');
    expect(typeof handler.attachCollisionHandler).toBe('function');
    expect(typeof handler.detachCollisionHandler).toBe('function');
  });

  it('should attach collision event listener', () => {
    const mockView = {
      props: { id: 'test-view', layer: 'PLAYER' },
      model: { health: 100 },
      events: {
        addEvent: vi.fn(),
        removeEvent: vi.fn(),
      },
      updateFillColor: vi.fn(),
    };
    const physics = createPhysics();
    const initialModel = { health: 100, speed: 1, collisionDamage: 10 };

    const handler = createCollisionHandler(mockView, physics, initialModel);
    handler.attachCollisionHandler();

    expect(mockView.events.addEvent).toHaveBeenCalledWith(
      'PLAYER-collide',
      expect.any(Function)
    );
  });

  it('should detach collision event listener', () => {
    const mockView = {
      props: { id: 'test-view', layer: 'PLAYER' },
      model: { health: 100 },
      events: {
        addEvent: vi.fn(),
        removeEvent: vi.fn(),
      },
      updateFillColor: vi.fn(),
    };
    const physics = createPhysics();
    const initialModel = { health: 100, speed: 1, collisionDamage: 10 };

    const handler = createCollisionHandler(mockView, physics, initialModel);
    handler.detachCollisionHandler();

    expect(mockView.events.removeEvent).toHaveBeenCalledWith('PLAYER-collide');
  });

  it('should handle collision with damage and force application', () => {
    const mockView = {
      props: { id: 'test-view', layer: 'PLAYER', position: { x: 50, y: 50 } },
      model: { health: 100 },
      fill: { color: 'blue', opacity: 1 },
      events: {
        addEvent: vi.fn(),
        removeEvent: vi.fn(),
      },
      updateFillColor: vi.fn(),
    };
    const physics = createPhysics();
    const initialModel = { health: 100, speed: 1, collisionDamage: 10 };

    const handler = createCollisionHandler(mockView, physics, initialModel);

    // Create a mock collision event with proper View types
    const mockView1: View = {
      id: 'test-view',
      model: {},
      layer: 'PLAYER',
      scale: 1,
      force: { x: 0, y: 0 },
      fill: { color: 'blue', opacity: 1 },
      stroke: { color: 'blue', opacity: 1, width: 1 },
      anchor: 'center',
      position: { x: 50, y: 50 },
      units: 'vh',
      shape: 'rect',
      geometry: { width: 10, height: 10, radius: 0 },
      textProps: {
        text: '',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
    };

    const mockView2: View = {
      id: 'other-view',
      model: { collisionDamage: 20 },
      layer: 'DEFAULT',
      scale: 1,
      force: { x: 0, y: 0 },
      fill: { color: 'red', opacity: 1 },
      stroke: { color: 'red', opacity: 1, width: 1 },
      anchor: 'center',
      position: { x: 60, y: 60 },
      units: 'vh',
      shape: 'rect',
      geometry: { width: 10, height: 10, radius: 0 },
      textProps: {
        text: '',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
    };

    const collision: Collision = {
      view1: mockView1,
      view2: mockView2,
    };

    const mockEvent = {
      detail: { collision },
    } as CustomEvent<{ collision: Collision }>;

    // Apply some initial force to verify it gets modified
    physics.applyForce({ x: 5, y: 5 });
    const initialForce = physics.getCurrentForce();

    // Handle the collision
    handler.handleCollide(mockEvent);

    // Check that health was reduced
    expect(mockView.model.health).toBe(80); // 100 - 20 damage

    // Check that fill color was updated (opacity should be 0.8)
    expect(mockView.updateFillColor).toHaveBeenCalledWith({
      color: 'blue',
      opacity: 0.8,
    });

    // Check that force was applied (should be different from initial)
    const finalForce = physics.getCurrentForce();
    expect(finalForce).not.toEqual(initialForce);
  });

  it('should ignore collisions not involving the view', () => {
    const mockView = {
      props: { id: 'test-view', layer: 'PLAYER', position: { x: 50, y: 50 } },
      model: { health: 100 },
      events: {
        addEvent: vi.fn(),
        removeEvent: vi.fn(),
      },
      updateFillColor: vi.fn(),
    };
    const physics = createPhysics();
    const initialModel = { health: 100, speed: 1, collisionDamage: 10 };

    const handler = createCollisionHandler(mockView, physics, initialModel);

    // Create a collision between two other views
    const mockView1: View = {
      id: 'other-view-1',
      model: {},
      layer: 'DEFAULT',
      scale: 1,
      force: { x: 0, y: 0 },
      fill: { color: 'red', opacity: 1 },
      stroke: { color: 'red', opacity: 1, width: 1 },
      anchor: 'center',
      position: { x: 10, y: 10 },
      units: 'vh',
      shape: 'rect',
      geometry: { width: 10, height: 10, radius: 0 },
      textProps: {
        text: '',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
    };

    const mockView2: View = {
      id: 'other-view-2',
      model: { collisionDamage: 20 },
      layer: 'DEFAULT',
      scale: 1,
      force: { x: 0, y: 0 },
      fill: { color: 'red', opacity: 1 },
      stroke: { color: 'red', opacity: 1, width: 1 },
      anchor: 'center',
      position: { x: 20, y: 20 },
      units: 'vh',
      shape: 'rect',
      geometry: { width: 10, height: 10, radius: 0 },
      textProps: {
        text: '',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
    };

    const collision: Collision = {
      view1: mockView1,
      view2: mockView2,
    };

    const mockEvent = {
      detail: { collision },
    } as CustomEvent<{ collision: Collision }>;

    // Handle the collision
    handler.handleCollide(mockEvent);

    // Check that nothing changed
    expect(mockView.model.health).toBe(100);
    expect(mockView.updateFillColor).not.toHaveBeenCalled();
  });

  it('should handle collision with entity without collisionDamage', () => {
    const mockView = {
      props: { id: 'test-view', layer: 'PLAYER', position: { x: 50, y: 50 } },
      model: { health: 100 },
      events: {
        addEvent: vi.fn(),
        removeEvent: vi.fn(),
      },
      updateFillColor: vi.fn(),
    };
    const physics = createPhysics();
    const initialModel = { health: 100, speed: 1, collisionDamage: 10 };

    const handler = createCollisionHandler(mockView, physics, initialModel);

    // Create a collision with an entity that has no collisionDamage
    const mockView1: View = {
      id: 'test-view',
      model: {},
      layer: 'PLAYER',
      scale: 1,
      force: { x: 0, y: 0 },
      fill: { color: 'blue', opacity: 1 },
      stroke: { color: 'blue', opacity: 1, width: 1 },
      anchor: 'center',
      position: { x: 50, y: 50 },
      units: 'vh',
      shape: 'rect',
      geometry: { width: 10, height: 10, radius: 0 },
      textProps: {
        text: '',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
    };

    const mockView2: View = {
      id: 'other-view',
      model: { health: 50 }, // No collisionDamage property
      layer: 'DEFAULT',
      scale: 1,
      force: { x: 0, y: 0 },
      fill: { color: 'red', opacity: 1 },
      stroke: { color: 'red', opacity: 1, width: 1 },
      anchor: 'center',
      position: { x: 60, y: 60 },
      units: 'vh',
      shape: 'rect',
      geometry: { width: 10, height: 10, radius: 0 },
      textProps: {
        text: '',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
      },
    };

    const collision: Collision = {
      view1: mockView1,
      view2: mockView2,
    };

    const mockEvent = {
      detail: { collision },
    } as CustomEvent<{ collision: Collision }>;

    // Handle the collision
    handler.handleCollide(mockEvent);

    // Check that nothing changed since other entity has no collisionDamage
    expect(mockView.model.health).toBe(100);
    expect(mockView.updateFillColor).not.toHaveBeenCalled();
  });
});
