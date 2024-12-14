export function cleanupJson(input: any): Object | null {
  if (!input) return null;

  if (Array.isArray(input)) {
    const result = input.reduce((acc: any[], cur) => {
      if (Array.isArray(cur)) acc.push(cleanupJson(cur));
      if (typeof cur !== 'object') acc.push(cur);
      return acc;
    }, []);

    return result.length ? result : null;
  }

  const value = Object.entries(input).reduce((acc: any, cur: [string, any]) => {
    const [key, value] = cur;

    if (!Array.isArray(value) && typeof value === 'object') return acc;

    if (!Array.isArray(value)) {
      acc[key] = value;
    }

    if (Array.isArray(value)) {
      const content = cleanupJson(value);
      if (content) acc[key] = content;
    }

    return acc;
  }, {});

  return Object.values(value).length ? value : null;
}
