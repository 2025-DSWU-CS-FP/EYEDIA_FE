interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

export default function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      className={`whitespace-nowrap rounded-[4px] px-[1.2rem] py-[0.8rem] transition-colors bd2 ${
        selected ? 'bg-brand-blue text-white' : 'bg-white text-gray-60'
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
