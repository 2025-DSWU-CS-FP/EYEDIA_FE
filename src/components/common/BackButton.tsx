import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <div className="w-full h-[6rem] flex items-center">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => navigate(-1)}
        className={`text-[2rem] text-gray-100 ml-[2.2rem] ${className}`}
      >
        <IoChevronBack />
      </button>
    </div>
  );
}
