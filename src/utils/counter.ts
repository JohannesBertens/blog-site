// Shared counter for generating deterministic unique IDs across component instances.
// Each call increments and returns the next integer.
let _global = 0;
export function nextId(): number {
  return ++_global;
}
