import { useState, useEffect } from 'react';

import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';
import { ExhibitionCardProps } from '@/types';

export default function ExhibitionCard({
  imageUrl,
  title,
  location,
}: ExhibitionCardProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setLoaded(true);
  }, [imageUrl]);

  return (
    <div className="w-40 flex-shrink-0">
      {!loaded ? (
        <Skeleton height={160} borderRadius={4} />
      ) : (
        <img
          src={imageUrl}
          alt={title}
          className="h-40 w-full rounded-sm object-cover"
        />
      )}

      <h3 className="w-32 text-black text-base font-medium leading-tight pt-2 pb-1">
        {loaded ? title : <Skeleton width={100} />}
      </h3>
      <p className="w-32 text-neutral-400 text-xs font-medium">
        {loaded ? location : <Skeleton width={80} />}
      </p>
    </div>
  );
}
