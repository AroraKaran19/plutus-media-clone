type Plain = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Plain =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Arrays and null replace the base; only an absent key falls through to the default.
export const deepMerge = <T>(base: T, source: unknown): T => {
  if (!isPlainObject(base) || !isPlainObject(source)) {
    return source === undefined ? base : (source as T);
  }

  const result: Plain = { ...base };

  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;
    result[key] = isPlainObject(base[key]) ? deepMerge(base[key], value) : value;
  }

  return result as T;
};
