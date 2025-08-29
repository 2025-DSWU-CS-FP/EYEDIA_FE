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
      <span className="font-semibold text-gray-80 t5">{label}</span>
      <IoChevronForward className="text-gray-80 t3" />
    </button>
  );
}
