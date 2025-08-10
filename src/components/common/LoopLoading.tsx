import { useMemo } from 'react';

interface LoopLoadingProps {
  size?: number;
}

export default function LoopLoading({ size = 40 }: LoopLoadingProps) {
  const BAR_COUNT = 10;
  const bars = useMemo(
    () => Array.from({ length: BAR_COUNT }, () => crypto.randomUUID()),
    [],
  );
  const step = 360 / BAR_COUNT;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-sm">
      <div
        className="relative"
        style={{ height: `${size}px`, width: `${size}px` }}
      >
        {bars.map((id, i) => (
          <div
            key={id}
            className="absolute left-1/2 top-1/2 origin-center"
            style={{
              transform: `rotate(${i * step}deg) translate(0, -${size / 3.1}px)`,
            }}
          >
            <div
              className="h-[1rem] w-[0.22rem] rounded-full bg-neutral-500"
              style={{
                animation: `spinner-fade 1.2s linear infinite`,
                animationDelay: `${(i * 0.1).toFixed(1)}s`,
              }}
            />
          </div>
        ))}

        <style>
          {`
            @keyframes spinner-fade {
              0% { opacity: 1; }
              39% { opacity: 0.6; }
              40% { opacity: 0.3; }
              100% { opacity: 0.1; }
            }
          `}
        </style>
      </div>
    </div>
  );
}
