import { FiMenu } from 'react-icons/fi';

interface MenuButtonProps {
  className?: string;
}

export default function MenuButton({ className = '' }: MenuButtonProps) {
  return (
    <div className="absolute top-8 left-1/2 -translate-x-1/2 max-w-[400px] px-4 flex justify-between z-10">
      <button
        type="button"
        aria-label="메뉴"
        className={`text-2xl mr-4 ${className}`}
      >
        <FiMenu />
      </button>
    </div>
  );
}
