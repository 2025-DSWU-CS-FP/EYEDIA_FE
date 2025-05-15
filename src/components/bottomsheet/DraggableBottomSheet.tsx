import { useRef, useState, useEffect, useCallback } from 'react';

type DraggableBottomSheetProps = {
  children: React.ReactNode;
  height?: number; // vh 단위로 받음
  minHeight?: number; // vh 단위로 받음
};

export default function DraggableBottomSheet({
  children,
  height = 80, // 전체 높이 (% of viewport height)
  minHeight = 10, // 최소 표시 높이
}: DraggableBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(height - minHeight);
  const translateYRef = useRef(translateY);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const maxTranslateY = height - minHeight;

  // 항상 최신 translateY 유지
  useEffect(() => {
    translateYRef.current = translateY;
  }, [translateY]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartY(e.clientY);
    setIsDragging(true);
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || dragStartY === null) return;
      const delta = e.clientY - dragStartY;
      const newY = Math.min(
        Math.max(translateYRef.current + delta, 0),
        maxTranslateY,
      );
      setTranslateY(newY);
      translateYRef.current = newY;
      setDragStartY(e.clientY);
    },
    [isDragging, dragStartY, maxTranslateY],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    setTranslateY(prev => (prev < maxTranslateY / 2 ? 0 : maxTranslateY));
  }, [isDragging, maxTranslateY]);

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

  return (
    <div
      ref={sheetRef}
      onPointerDown={handlePointerDown}
      className="
        fixed bottom-4 left-1/2
        w-full sm:w-[90%] md:max-w-[400px]
        bg-white rounded-t-2xl shadow-lg z-10
        transition-transform duration-300
        touch-none
      "
      style={{
        transform: `translate(-50%, ${translateY}vh)`,
        height: `${height}vh`,
        touchAction: 'none',
      }}
    >
      {/* 드래그 핸들 */}
      <div className="w-10 h-1.5 bg-gray-400 rounded-full mx-auto mt-2 mb-2" />
      <div className="px-4 overflow-y-auto max-h-[calc(100%-40px)]">
        {children}
      </div>
    </div>
  );
}
