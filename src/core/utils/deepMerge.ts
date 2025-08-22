/**
 * Deep merge utility function that merges nested objects
 * @param target - The target object to merge into
 * @param source - The source object to merge from
 * @returns The merged object
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: any
): T {
  const result = { ...target };

  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = (target as any)[key];

      if (
        sourceValue &&
        typeof sourceValue === 'object' &&
        !Array.isArray(sourceValue) &&
        targetValue &&
        typeof targetValue === 'object' &&
        !Array.isArray(targetValue)
      ) {
        // Recursively merge nested objects
        (result as any)[key] = deepMerge(targetValue, sourceValue);
      } else {
        // For non-objects or arrays, use the source value
        (result as any)[key] = sourceValue;
      }
    }
  }

  return result;
}
