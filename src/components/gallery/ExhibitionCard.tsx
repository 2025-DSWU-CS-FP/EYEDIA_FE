interface ExhibitionCardProps {
  id?: number;
  title: string;
  count: number;
  img: string;
}

export default function ExhibitionCard({
  id,
  title,
  count,
  img,
}: ExhibitionCardProps) {
  return (
    <div
      className="h-72 w-full bg-cover bg-center px-3.5 pt-3 pb-4 flex flex-col justify-end gap-1.5 rounded-md"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%), url(${img})`,
      }}
    >
      <div className="text-white text-base font-medium leading-tight [text-shadow:_0px_0px_11px_rgba(0,0,0,0.25)]">
        {title.split('\n').map(line => (
          <div key={id}>{line}</div>
        ))}
      </div>
      <div className="text-neutral-400 text-xs font-medium text-right [text-shadow:_0px_0px_4px_rgba(0,0,0,0.25)]">
        작품 {count}
      </div>
    </div>
  );
}
