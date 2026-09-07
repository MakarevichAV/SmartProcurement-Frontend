/**
 * Tiny class-name joiner — keeps component markup readable without pulling in a
 * dependency. Falsy values are dropped; truthy strings are space-joined.
 */
export type ClassValue = string | number | false | null | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
