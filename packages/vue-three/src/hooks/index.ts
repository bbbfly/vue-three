const camelCase = (str: string): string => {
  return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
}

export const useCamelCaseKeys = <T extends Record<string, unknown>>(
  obj: T
): Record<string, unknown> => {
  const result: Record<string, unknown> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelKey = camelCase(key)
      result[camelKey] = obj[key]
    }
  }
  return result
}
