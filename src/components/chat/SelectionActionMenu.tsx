import React from 'react';

export default function SelectionActionMenu({
  top,
  left,
  menuRef,
  onExtract,
  onCancel,
}: {
  top: number;
  left: number;
  menuRef: React.RefObject<HTMLDivElement>;
  onExtract: () => void;
  onCancel: () => void;
}) {
  return (
    <div ref={menuRef} className="absolute z-50" style={{ top, left }}>
      <div className="relative inline-flex flex-col items-center">
        {/* 삼각형 */}
        <div className="w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-[#8F2E39]" />

        {/* 본체 */}
        <div className="flex items-center gap-2 px-4 py-1.5 bg-[#8F2E39] rounded-[4px]">
          <button
            type="button"
            aria-label="취소"
            className="text-white text-sm leading-tight"
            onClick={onCancel}
          >
            취소
          </button>
          <div className="w-px h-4 bg-white opacity-30" />
          <button
            type="button"
            aria-label="발췌"
            className="text-white text-sm leading-tight"
            onClick={onExtract}
          >
            발췌
          </button>
        </div>
      </div>
    </div>
  );
}
