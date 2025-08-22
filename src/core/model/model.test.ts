import { describe, it, expect } from 'vitest';
import { createModel } from './model';
import type { Model } from './types';

describe('createModel', () => {
  it('should return an object with correct properties', () => {
    const testData = {
      name: 'test',
      health: 100,
      position: {
        x: 100,
        y: 100,
      },
      speed: 10,
    };

    const result = createModel(testData);

    // Check that result is a Model type
    expect(result).toMatchObject<Model>({
      id: expect.any(String),
      createdAt: expect.any(Date),
    });

    // Check that all original properties are preserved
    expect(result).toMatchObject(testData);

    // Check specific property types
    expect(typeof result.id).toBe('string');
    expect(result.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
    expect(result.createdAt).toBeInstanceOf(Date);

    // Check that the original object properties are intact
    expect(result.name).toBe('test');
    expect(result.health).toBe(100);
    expect(result.position).toEqual({ x: 100, y: 100 });
    expect(result.speed).toBe(10);
  });

  it('should generate unique IDs for different models', () => {
    const model1 = createModel({ name: 'model1' });
    const model2 = createModel({ name: 'model2' });

    expect(model1.id).not.toBe(model2.id);
  });

  it('should create different timestamps for different models', () => {
    const model1 = createModel({ name: 'model1' });
    const model2 = createModel({ name: 'model2' });

    expect(model1.createdAt.getTime()).toBeLessThanOrEqual(
      model2.createdAt.getTime()
    );
  });
});
