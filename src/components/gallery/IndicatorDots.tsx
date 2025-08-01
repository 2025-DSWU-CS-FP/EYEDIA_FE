interface IndicatorDotsProps {
  count?: number;
  activeIndex?: number;
}

const DOT_KEYS = ['dot-1', 'dot-2', 'dot-3', 'dot-4', 'dot-5'];

export default function IndicatorDots({
  count = 5,
  activeIndex = 0,
}: IndicatorDotsProps) {
  return (
    <div className="flex gap-[0.6rem]">
      {DOT_KEYS.slice(0, count).map((key, i) => (
        <div
          key={key}
          className={`h-[0.8rem] w-[0.8rem] rounded-full ${
            i === activeIndex ? 'bg-blue-500' : 'bg-neutral-200'
          }`}
        />
      ))}
    </div>
  );
}
