export function timeout(delay: number): Promise<number> {
  return new Promise(res => setTimeout(res, delay));
}