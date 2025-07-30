interface Keyword {
  id: string;
  label: string;
  isSelected: boolean;
}

interface KeywordListProps {
  keywords: Keyword[];
}

export default function KeywordList({ keywords }: KeywordListProps) {
  return (
    <div className="flex flex-wrap gap-[0.8rem]">
      {keywords.map(kw => (
        <div
          key={kw.id}
          className={`cursor-pointer px-[1.2rem] py-[0.8rem] rounded-[4px] flex justify-center items-center gap-2.5 ${
            kw.isSelected ? 'bg-gray-80 text-gray-0' : 'bg-gray-0 text-gray-60'
          }`}
        >
          <div className="justify-start text-ct3">{kw.label}</div>
        </div>
      ))}
    </div>
  );
}
