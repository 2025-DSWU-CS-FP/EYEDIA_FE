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
      <div className="relative flex flex-col items-center">
        <div className="h-0 w-0 border-x-[6px] border-b-[6px] border-x-transparent border-b-gray-80" />

        <div className="flex items-center gap-[1.2rem] rounded-[4px] bg-gray-80 px-[1.2rem] py-[0.6rem]">
          <button
            type="button"
            aria-label="취소"
            className="text-gray-0 bt3"
            onClick={onCancel}
          >
            취소
          </button>
          <div className="h-[1.2rem] w-px bg-gray-5" />
          <button
            type="button"
            aria-label="발췌"
            className="text-gray-0 bt3"
            onClick={onExtract}
          >
            발췌
          </button>
        </div>
      </div>
    </div>
  );
}
