/**
 * Utility to check if we're running in the browser environment
 * @returns true if window object is available (client-side), false otherwise (server-side)
 */
export function ensureDom(): boolean {
  return typeof window !== 'undefined'
}

