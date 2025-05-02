interface BannerItem {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  date: string;
}

interface BannerCarouselProps {
  banners: BannerItem[];
}

export default function BannerCarousel({ banners }: BannerCarouselProps) {
  return (
    <div className="w-full overflow-hidden">
      {banners.map(banner => (
        <div
          key={banner.id}
          className="relative h-[487px] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${banner.imageUrl})` }}
        >
          <div className="absolute inset-0 flex flex-col justify-end pb-7 bg-black bg-opacity-50 px-4 text-white">
            <span className="text-sm">{banner.subtitle}</span>
            <h2 className="text-xl font-semibold">{banner.title}</h2>
            <p className="text-sm">{banner.date}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
