import { KeywordListProps } from '@/types';

export default function KeywordList({ keywords }: KeywordListProps) {
  return (
    <div className="flex flex-wrap gap-[0.8rem] pr-[2.7rem]">
      {keywords.map(kw => (
        <div
          key={kw.id}
          className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-[4px] px-[1.2rem] py-[0.8rem] ${
            kw.isSelected ? 'bg-gray-80 text-gray-0' : 'bg-gray-0 text-gray-60'
          }`}
        >
          <div className="justify-start text-ct3">{kw.label}</div>
        </div>
      ))}
    </div>
  );
}
