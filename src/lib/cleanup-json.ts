export function cleanupJson(input: any): object | null {
  if (!input) return null;
  if (typeof input !== 'object') return input;
  if (Array.isArray(input)) return null;

  const value = Object.entries(input).reduce((acc: any, cur: [string, any]) => {
    const [key, value] = cur;

    if (!Array.isArray(value) && typeof value === 'object') {
      acc[key] = '<object>';
      return acc;
    }

    if (Array.isArray(value)) {
      acc[key] = '<array>';
      return acc;
    }

    acc[key] = value;
    return acc;
  }, {});

  return Object.values(value).length ? value : null;
}
