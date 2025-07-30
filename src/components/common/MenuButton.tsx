import { FiMenu } from 'react-icons/fi';

interface MenuButtonProps {
  className?: string;
}

export default function MenuButton({ className = '' }: MenuButtonProps) {
  return (
    <div className="absolute left-1/2 top-8 z-10 flex max-w-[400px] -translate-x-1/2 justify-between px-4">
      <button
        type="button"
        aria-label="메뉴"
        className={`mr-4 text-2xl ${className}`}
      >
        <FiMenu />
      </button>
    </div>
  );
}
