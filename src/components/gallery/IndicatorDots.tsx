interface IndicatorDotsProps {
  count?: number;
  activeIndex?: number;
  onDotClick?: (index: number) => void;
}

const DOT_KEYS = ['dot-1', 'dot-2', 'dot-3', 'dot-4', 'dot-5'];

export default function IndicatorDots({
  count = 5,
  activeIndex = 0,
  onDotClick,
}: IndicatorDotsProps) {
  return (
    <div className="flex gap-[0.6rem]">
      {DOT_KEYS.slice(0, count).map((key, i) => (
        <button
          key={key}
          type="button"
          aria-label={`작품 ${i + 1} 보기`}
          onClick={() => onDotClick?.(i)}
          className={`h-[0.8rem] w-[0.8rem] rounded-full transition-colors ${
            i === activeIndex ? 'bg-blue-500' : 'bg-neutral-200'
          }`}
        />
      ))}
    </div>
  );
}
