import { describe, it, expect, vi } from 'vitest';
import { screenSaver } from './screenSaver';

describe('screenSaver', () => {
  it('should apply force using physics system', () => {
    const mockPhysics = {
      applyForce: vi.fn(),
      getCurrentForce: vi.fn().mockReturnValue({ x: 0, y: 0 }),
      update: vi.fn(),
      reset: vi.fn(),
    };

    const mockView = {
      props: {
        id: 'test-cube',
        position: { x: 50, y: 50 },
        units: 'vh',
        shapeProps: { width: 10, height: 10 },
      },
      model: { health: 10, speed: 0.1, collisionDamage: 1 },
      physics: mockPhysics,
    };

    const deltaTime = 16; // 60fps

    // Call screenSaver
    screenSaver(mockView as any, deltaTime);

    // Check that applyForce was called
    expect(mockPhysics.applyForce).toHaveBeenCalledWith({
      x: expect.any(Number),
      y: expect.any(Number),
    });

    // Check that the force values are reasonable
    const callArgs = mockPhysics.applyForce.mock.calls[0][0];
    expect(callArgs.x).toBeGreaterThanOrEqual(-1);
    expect(callArgs.x).toBeLessThanOrEqual(1);
    expect(callArgs.y).toBeGreaterThanOrEqual(-1);
    expect(callArgs.y).toBeLessThanOrEqual(1);
  });

  it('should change direction when hitting boundaries', () => {
    const mockPhysics = {
      applyForce: vi.fn(),
      getCurrentForce: vi.fn().mockReturnValue({ x: 0, y: 0 }),
      update: vi.fn(),
      reset: vi.fn(),
    };

    const mockView = {
      props: {
        id: 'test-cube',
        position: { x: 95, y: 95 }, // Near boundary
        units: 'vh',
        shapeProps: { width: 10, height: 10 },
      },
      model: { health: 10, speed: 0.1, collisionDamage: 1 },
      physics: mockPhysics,
    };

    const deltaTime = 16;

    // Call screenSaver multiple times to test boundary behavior
    screenSaver(mockView as any, deltaTime);
    screenSaver(mockView as any, deltaTime);

    // Should have called applyForce at least once
    expect(mockPhysics.applyForce).toHaveBeenCalled();
  });

  it('should handle different deltaTime values', () => {
    const mockPhysics = {
      applyForce: vi.fn(),
      getCurrentForce: vi.fn().mockReturnValue({ x: 0, y: 0 }),
      update: vi.fn(),
      reset: vi.fn(),
    };

    const mockView = {
      props: {
        id: 'test-cube',
        position: { x: 50, y: 50 },
        units: 'vh',
        shapeProps: { width: 10, height: 10 },
      },
      model: { health: 10, speed: 0.1, collisionDamage: 1 },
      physics: mockPhysics,
    };

    // Test with different deltaTime values
    const deltaTimes = [8, 16, 32, 64];

    deltaTimes.forEach(deltaTime => {
      mockPhysics.applyForce.mockClear();
      screenSaver(mockView as any, deltaTime);

      expect(mockPhysics.applyForce).toHaveBeenCalledWith({
        x: expect.any(Number),
        y: expect.any(Number),
      });
    });
  });

  it('should normalize force by deltaTime', () => {
    const mockPhysics = {
      applyForce: vi.fn(),
      getCurrentForce: vi.fn().mockReturnValue({ x: 0, y: 0 }),
      update: vi.fn(),
      reset: vi.fn(),
    };

    const mockView = {
      props: {
        id: 'test-cube',
        position: { x: 50, y: 50 },
        units: 'vh',
        shapeProps: { width: 10, height: 10 },
      },
      model: { health: 10, speed: 0.1, collisionDamage: 1 },
      physics: mockPhysics,
    };

    // Test with different deltaTime values and check force scaling
    const testCases = [
      { deltaTime: 8, expectedFactor: 0.5 },
      { deltaTime: 16, expectedFactor: 1.0 },
      { deltaTime: 32, expectedFactor: 2.0 },
    ];

    testCases.forEach(({ deltaTime, expectedFactor }) => {
      mockPhysics.applyForce.mockClear();
      screenSaver(mockView as any, deltaTime);

      const callArgs = mockPhysics.applyForce.mock.calls[0][0];
      // Force should be proportional to deltaTime/16
      expect(Math.abs(callArgs.x)).toBeCloseTo(0.4 * expectedFactor, 1);
      expect(Math.abs(callArgs.y)).toBeCloseTo(0.4 * expectedFactor, 1);
    });
  });
});
