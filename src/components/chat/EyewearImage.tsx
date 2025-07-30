interface EyewearImageProps {
  src: string;
  alt: string;
}
function EyewearImage({ src, alt }: EyewearImageProps) {
  return (
    <div className="flex h-44 items-center justify-center">
      <img src={src} alt={alt} className="h-auto w-[220px]" />
    </div>
  );
}

export default EyewearImage;
