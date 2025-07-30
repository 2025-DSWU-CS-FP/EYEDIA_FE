import { IoChevronForward } from 'react-icons/io5';

interface MenuItemProps {
  label: string;
  onClick?: () => void;
}

export default function MenuItem({ label, onClick }: MenuItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between"
    >
      <span className="text-t5 font-semibold text-gray-80">{label}</span>
      <IoChevronForward className="text-t3 text-gray-80" />
    </button>
  );
}
