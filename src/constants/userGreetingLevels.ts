export interface ViewLevel {
  max: number;
  msg: string;
}

export const USER_GREETING_LEVELS: ViewLevel[] = [
  { max: 0, msg: '첫 전시를 시작해볼까요?' },
  { max: 2, msg: '좋은 출발이에요.' },
  { max: 5, msg: '꾸준히 즐기고 계시네요.' },
  { max: 9, msg: '전시 마니아의 길로!' },
  { max: Infinity, msg: '전시의 달인이시네요.' },
];

export function getPraiseMessage(
  count: number,
  levels: ViewLevel[] = USER_GREETING_LEVELS,
): string {
  const c = Number.isFinite(count) && count >= 0 ? count : 0;
  const found = levels.find(l => c <= l.max);
  return found ? found.msg : levels[levels.length - 1].msg;
}
