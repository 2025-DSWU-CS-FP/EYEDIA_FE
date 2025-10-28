import React from 'react';

import { createPortal } from 'react-dom';

type MenuContentProps = {
  top: number;
  left: number;
  menuRef: React.RefObject<HTMLDivElement>;
  onExtract: () => void;
  onCancel: () => void;
};

function MenuContent({
  top,
  left,
  menuRef,
  onExtract,
  onCancel,
}: MenuContentProps) {
  return (
    <div
      ref={menuRef}
      className="fixed z-[9999]"
      style={{ top, left, transform: 'translateZ(0)' }}
    >
      <div className="relative inline-flex flex-col items-center">
        <div className="h-0 w-0 border-x-[6px] border-b-[6px] border-x-transparent border-b-gray-80" />
        <div className="flex items-center gap-[1.2rem] rounded-[4px] bg-gray-80 px-[1.2rem] py-[0.6rem] shadow-lg">
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

type SelectionActionMenuProps = MenuContentProps & {
  portal?: boolean;
  container?: Element | null;
};

export default function SelectionActionMenu({
  top,
  left,
  menuRef,
  onExtract,
  onCancel,
  portal = true,
  container = typeof document !== 'undefined' ? document.body : null,
}: SelectionActionMenuProps) {
  const content = (
    <MenuContent
      top={top}
      left={left}
      menuRef={menuRef}
      onExtract={onExtract}
      onCancel={onCancel}
    />
  );

  if (portal && container) {
    return createPortal(content, container);
  }
  return content;
}
