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
      className="flex justify-between items-center w-full"
    >
      <span className="text-gray-80 text-t5 font-semibold">{label}</span>
      <IoChevronForward className="text-gray-80 text-t3" />
    </button>
  );
}
