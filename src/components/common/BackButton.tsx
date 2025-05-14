import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <div className="absolute top-8 z-50 left-1/2 w-[400px] max-w-full -translate-x-1/2">
      <button
        type="button"
        aria-label="뒤로가기"
        onClick={() => navigate(-1)}
        className={`text-2xl ml-4 ${className}`}
      >
        <IoChevronBack />
      </button>
    </div>
  );
}
