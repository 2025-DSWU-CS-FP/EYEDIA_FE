import { useState } from 'react';

import { useNavigate } from 'react-router-dom';

import sortIcon from '@/assets/icons/sort.svg';
import BackButton from '@/components/common/BackButton';
import ArtworkDetailModal from '@/components/gallery-detail/ArtworkDetailModal';
import ArtworkImageGrid from '@/components/gallery-detail/ArtworkImageGrid';
import GalleryInfoHeader from '@/components/gallery-detail/GalleryInfoHeader';
import { artworkImages, galleryInfo } from '@/mock/galleryDetailData';

export default function GalleryDetailPage() {
  const navigate = useNavigate();
  const [selectedArt, setSelectedArt] = useState<string | null>(null);

  const selectedData = artworkImages.find(art => art.id === selectedArt);
  return (
    <div className="relative bg-white min-h-screen">
      <div className="relative w-full h-[355px]">
        <BackButton className="absolute top-12 left-4 z-10 text-black" />
        <img
          src={galleryInfo.coverImage}
          alt="전시 커버"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white" />
      </div>

      <GalleryInfoHeader
        title={galleryInfo.title}
        location={galleryInfo.location}
        date={galleryInfo.date}
      />

      <div className="absolute left-[18px] top-[315px] w-[90%] flex justify-between items-end">
        <span className="text-sm font-medium text-neutral-800">
          작품
          {artworkImages.length}개
        </span>
        <span className="text-xs font-medium text-neutral-800 flex items-center gap-1">
          최신순
          <img src={sortIcon} alt="정렬" />
        </span>
      </div>

      <ArtworkImageGrid
        images={artworkImages}
        onClickImage={id => setSelectedArt(id)}
      />
      {selectedArt && selectedData && (
        <ArtworkDetailModal
          src={selectedData.src}
          title={selectedData.title}
          artist={selectedData.artist}
          lastChatDate={selectedData.lastChatDate}
          onClose={() => setSelectedArt(null)}
          onContinueChat={() => navigate('/chat-artwork')}
        />
      )}
    </div>
  );
}
