import { useState } from 'react';

import { KeywordListProps } from '@/types';

export default function KeywordList({ keywords }: KeywordListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(() => {
    const initiallySelected = keywords.find(k => k.isSelected);
    return initiallySelected?.id ?? null;
  });

  return (
    <div className="flex flex-wrap gap-[0.8rem] pr-[2.7rem]">
      {keywords.map(kw => {
        const isSelected = kw.id === selectedId;
        return (
          <div
            key={kw.id}
            onClick={() => setSelectedId(kw.id)}
            className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-[4px] px-[1.2rem] py-[0.8rem] ${
              isSelected ? 'bg-gray-80 text-gray-0' : 'bg-gray-0 text-gray-60'
            }`}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setSelectedId(kw.id);
            }}
          >
            <div className="justify-start text-ct3">{kw.label}</div>
          </div>
        );
      })}
    </div>
  );
}
