import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <div className="flex h-[6rem] w-full items-center">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => navigate(-1)}
        className={`ml-[2.2rem] text-[2rem] text-gray-100 ${className}`}
      >
        <IoChevronBack />
      </button>
    </div>
  );
}
