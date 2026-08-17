type ClassValue = string | false | null | undefined

/**
 * Joins class names, dropping falsy entries. CSS-module lookups are typed as
 * `string | undefined` under `noUncheckedIndexedAccess`, so they cannot be
 * interpolated into a template literal directly.
 */
export function cx(...values: ClassValue[]): string | undefined {
  const classNames = values.filter((value): value is string => Boolean(value))

  return classNames.length > 0 ? classNames.join(' ') : undefined
}
