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
        <div className="h-0 w-0 border-x-[6px] border-b-[6px] border-x-transparent border-b-[#8F2E39]" />

        {/* 본체 */}
        <div className="flex items-center gap-2 rounded-[4px] bg-[#8F2E39] px-4 py-1.5">
          <button
            type="button"
            aria-label="취소"
            className="text-sm leading-tight text-white"
            onClick={onCancel}
          >
            취소
          </button>
          <div className="h-4 w-px bg-white opacity-30" />
          <button
            type="button"
            aria-label="발췌"
            className="text-sm leading-tight text-white"
            onClick={onExtract}
          >
            발췌
          </button>
        </div>
      </div>
    </div>
  );
}
