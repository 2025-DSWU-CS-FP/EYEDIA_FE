interface RecommendItem {
  id: string;
  imageUrl: string;
  altText: string;
}

interface RecommendGridProps {
  items: RecommendItem[];
}

export default function RecommendGrid({ items }: RecommendGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map(item => (
        <img
          key={item.id}
          src={item.imageUrl}
          alt={item.altText}
          className="h-40 w-full rounded-sm object-cover"
        />
      ))}
    </div>
  );
}
