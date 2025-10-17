import { useMemo, useRef, useState, useEffect } from 'react';

import { KeywordListProps } from '@/types';

interface KeywordListExtendedProps extends KeywordListProps {
  isLoading?: boolean;
  skeletonCount?: number;
  onSelect?: (id: string) => void;
}

const makeIds = (n: number) =>
  Array.from(
    { length: n },
    () =>
      globalThis.crypto?.randomUUID?.() ??
      `${Math.random().toString(36).slice(2)}-${Date.now()}`,
  );

export default function KeywordList({
  keywords,
  isLoading = false,
  skeletonCount = 6,
  onSelect,
}: KeywordListExtendedProps) {
  const initiallySelected = useMemo(
    () => keywords.find(k => k.isSelected)?.id ?? null,
    [keywords],
  );
  const [selectedId, setSelectedId] = useState<string | null>(
    initiallySelected,
  );

  const skeletonKeysRef = useRef<string[]>(makeIds(skeletonCount));
  useEffect(() => {
    if (skeletonKeysRef.current.length !== skeletonCount) {
      skeletonKeysRef.current = makeIds(skeletonCount);
    }
  }, [skeletonCount]);

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-[0.8rem] pr-[2.7rem]">
        {skeletonKeysRef.current.map(id => (
          <span
            key={id}
            className="animate-pulse h-[3.2rem] w-[8rem] rounded-[20px] bg-gray-10"
          />
        ))}
        <span className="sr-only">키워드를 불러오는 중…</span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-wrap gap-[0.8rem] pr-[2.7rem]"
      role="radiogroup"
      aria-label="추천 키워드"
    >
      {keywords.map(kw => {
        const isSelected = kw.id === selectedId;
        return (
          <button
            type="button"
            key={kw.id}
            role="radio"
            aria-checked={isSelected}
            onClick={() => {
              setSelectedId(kw.id);
              onSelect?.(kw.id);
            }}
            className={[
              'flex items-center justify-center gap-2.5 rounded-[4px] px-[1.2rem] py-[0.8rem] transition-colors ct3',
              isLoading ? '' : 'cursor-pointer',
              isSelected ? 'bg-gray-80 text-gray-0' : 'bg-gray-0 text-gray-60',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-40',
            ].join(' ')}
          >
            <span>{kw.label}</span>
            <span className="sr-only">{isSelected ? '선택됨' : ''}</span>
          </button>
        );
      })}
    </div>
  );
}
