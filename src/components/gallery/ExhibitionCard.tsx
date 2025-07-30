import { Link } from 'react-router-dom';

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
    <Link to={`/gallery/${id}`}>
      <div
        className="flex h-72 w-full flex-col justify-end gap-1.5 rounded-md bg-cover bg-center px-3.5 pb-4 pt-3"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%), url(${img})`,
        }}
      >
        <div className="text-base font-medium leading-tight text-white [text-shadow:_0px_0px_11px_rgba(0,0,0,0.25)]">
          {title.split('\n').map(line => (
            <div key={id}>{line}</div>
          ))}
        </div>
        <div className="text-right text-xs font-medium text-neutral-400 [text-shadow:_0px_0px_4px_rgba(0,0,0,0.25)]">
          작품 {count}
        </div>
      </div>
    </Link>
  );
}
