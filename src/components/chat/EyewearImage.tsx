interface EyewearImageProps {
  src: string;
  alt: string;
}
function EyewearImage({ src, alt }: EyewearImageProps) {
  return (
    <div className="flex justify-center items-center h-44">
      <img src={src} alt={alt} className="w-[220px] h-auto" />
    </div>
  );
}

export default EyewearImage;
