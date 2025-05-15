import { useRef, useState, useEffect } from 'react';

type DraggableBottomSheetProps = {
  children: React.ReactNode;
  height?: number;
  minHeight?: number;
};

export default function DraggableBottomSheet({
  children,
  height = 500,
  minHeight = 80,
}: DraggableBottomSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [translateY, setTranslateY] = useState(height - minHeight);
  const [dragStartY, setDragStartY] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const maxTranslateY = height - minHeight;

  const handlePointerDown = (e: React.PointerEvent) => {
    setDragStartY(e.clientY);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || dragStartY === null) return;
    const delta = e.clientY - dragStartY;
    const newY = Math.min(Math.max(translateY + delta, 0), maxTranslateY);
    setTranslateY(newY);
    setDragStartY(e.clientY);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    // 열림 / 닫힘 판단 (기준: 시트 절반 이상 위로 올라왔는지)
    setTranslateY(prev => (prev < maxTranslateY / 2 ? 0 : maxTranslateY));
  };

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('pointerup', handleMouseUp);
    return () => window.removeEventListener('pointerup', handleMouseUp);
  }, []);

  return (
    <div
      ref={sheetRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className="
        fixed bottom-4 left-1/2
        w-full sm:w-[90%] md:max-w-[400px]
        bg-white rounded-t-2xl shadow-lg z-10
        transition-transform duration-300 touch-none
        "
      style={{
        transform: `translate(-50%, ${translateY}px)`,
        height: `${height}px`,
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
