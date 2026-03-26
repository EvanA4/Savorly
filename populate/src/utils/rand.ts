export function shuffle<T>(arr: Array<T>): void {
  arr.sort(function (_a, _b) {
    return Math.random() - 0.5;
  });
}

export function randpick<T>(arr: Array<T>, count: number): Array<T> {
  const toShuffle = [...arr];
  shuffle(toShuffle);
  return toShuffle.slice(0, count);
}
