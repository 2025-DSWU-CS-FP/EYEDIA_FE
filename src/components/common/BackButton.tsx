import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      aria-label="뒤로가기"
      onClick={() => navigate(-1)}
      className={`text-2xl ${className}`}
    >
      <IoChevronBack />
    </button>
  );
}
