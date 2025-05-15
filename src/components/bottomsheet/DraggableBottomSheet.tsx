import { useRef, useState, useEffect, useCallback } from 'react';

type DraggableBottomSheetProps = {
  children: React.ReactNode;
  height?: number;
  minHeight?: number;
};

export default function DraggableBottomSheet({
  children,
  height = 80,
  minHeight = 70,
}: DraggableBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [sheetHeight, setSheetHeight] = useState<number>(0);
  const [translateY, setTranslateY] = useState<number>(0);
  const translateYRef = useRef(0);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // 초기 높이 계산
  useEffect(() => {
    const vh = window.innerHeight;
    const calculatedHeight = (vh * height) / 100;
    const initialTranslateY = calculatedHeight - minHeight;
    setSheetHeight(calculatedHeight);
    setTranslateY(initialTranslateY);
    translateYRef.current = initialTranslateY;
  }, [height, minHeight]);

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
        sheetHeight - minHeight,
      );
      setTranslateY(newY);
      translateYRef.current = newY;
      setDragStartY(e.clientY);
    },
    [isDragging, dragStartY, sheetHeight, minHeight],
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    const threshold = (sheetHeight - minHeight) / 2;
    setTranslateY(prev => (prev < threshold ? 0 : sheetHeight - minHeight));
  }, [isDragging, sheetHeight, minHeight]);

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
        transition-transform duration-300 touch-none
      "
      style={{
        transform: `translate(-50%, ${translateY}px)`,
        height: `${sheetHeight}px`,
        touchAction: 'none',
      }}
    >
      <div className="w-10 h-1.5 bg-gray-400 rounded-full mx-auto my-3" />
      <div className="px-4 overflow-y-auto max-h-[calc(100%-40px)]">
        {children}
      </div>
    </div>
  );
}
