export function toggleRanking(current: string[], value: string, limit = 3) {
  if (current.includes(value)) return current.filter((item) => item !== value);
  if (current.length >= limit) return current;
  return [...current, value];
}
