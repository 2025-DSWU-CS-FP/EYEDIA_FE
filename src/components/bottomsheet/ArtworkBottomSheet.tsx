import { useEffect, useState, useRef, useCallback } from 'react';

interface ArtworkBottomSheetProps {
  children: React.ReactNode;
  isVisible: boolean;
  onExpandChange?: (expanded: boolean) => void;
}

export default function ArtworkBottomSheet({
  children,
  isVisible,
  onExpandChange,
}: ArtworkBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(0);
  const translateYRef = useRef(0);

  const MIN_HEIGHT_VH = 70;
  const MAX_HEIGHT_VH = 100;

  const minTranslateY = window.innerHeight * (1 - MAX_HEIGHT_VH / 100); // 0px
  const maxTranslateY = window.innerHeight * (1 - MIN_HEIGHT_VH / 100); // 예: 30% 아래

  const isFullyExpanded = translateY === minTranslateY;

  useEffect(() => {
    if (isVisible) {
      setTranslateY(maxTranslateY);
      translateYRef.current = maxTranslateY;
    }
  }, [isVisible, maxTranslateY]);

  useEffect(() => {
    translateYRef.current = translateY;
  }, [translateY]);

  useEffect(() => {
    if (!onExpandChange) return;
    const threshold = (maxTranslateY + minTranslateY) / 2;
    onExpandChange(translateY < threshold);
  }, [translateY, minTranslateY, maxTranslateY, onExpandChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isFullyExpanded) return;
    setDragStartY(e.clientY);
    setIsDragging(true);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || dragStartY === null) return;
      const delta = e.clientY - dragStartY;
      const newY = Math.min(
        Math.max(translateYRef.current + delta, minTranslateY),
        maxTranslateY,
      );
      setTranslateY(newY);
    },
    [isDragging, dragStartY, minTranslateY, maxTranslateY],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    const threshold = (maxTranslateY + minTranslateY) / 2;
    setTranslateY(prev => (prev < threshold ? minTranslateY : maxTranslateY));
  }, [minTranslateY, maxTranslateY]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    } else {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  if (!isVisible) return null;

  return (
    <div className="fixed flex justify-center items-end transition-all duration-500 ease-in-out">
      <div
        ref={sheetRef}
        onPointerDown={handlePointerDown}
        className={`
          w-full max-w-[425px] bg-neutral-900 transition-transform duration-300 touch-none
          ${isFullyExpanded ? '' : 'rounded-t-2xl'}
        `}
        style={{
          transform: `translateY(${translateY}px)`,
          height: `calc(100vh - ${translateY}px)`,
          touchAction: 'none',
        }}
      >
        {!isFullyExpanded && (
          <div className="w-10 h-1.5 bg-gray-500 rounded-full mx-auto my-3" />
        )}

        <div className="px-6 overflow-y-auto max-h-[calc(100%-40px)] pb-32">
          {children}
        </div>
      </div>
    </div>
  );
}
