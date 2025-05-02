interface RecommendItem {
  id: string;
  imageUrl: string;
  altText: string;
}

interface RecommendGridProps {
  items: RecommendItem[];
}

export default function RecommendGrid({ items }: RecommendGridProps) {
  const half = Math.ceil(items.length / 2);
  const topRow = items.slice(0, half);
  const bottomRow = items.slice(half);

  return (
    <div className="space-y-2">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {topRow.map(item => (
          <img
            key={item.id}
            src={item.imageUrl}
            alt={item.altText}
            className="h-40 w-auto flex-shrink-0 object-contain rounded-sm"
          />
        ))}
      </div>

      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {bottomRow.map(item => (
          <img
            key={item.id}
            src={item.imageUrl}
            alt={item.altText}
            className="h-40 w-auto flex-shrink-0 object-contain rounded-sm"
          />
        ))}
      </div>
    </div>
  );
}
