interface ExhibitionCardProps {
  imageUrl: string;
  title: string;
  location: string;
}

export default function ExhibitionCard({
  imageUrl,
  title,
  location,
}: ExhibitionCardProps) {
  return (
    <div className="w-40 flex-shrink-0">
      <img
        src={imageUrl}
        alt={title}
        className="h-40 w-full rounded-md object-cover"
      />
      <h3 className="mt-1 text-sm font-medium">{title}</h3>
      <p className="text-xs text-gray-500">{location}</p>
    </div>
  );
}
