import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

export default function HeaderWithBack() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-1/2 -translate-x-1/2 z-30 w-full max-w-[375px] px-4 pt-12 pb-3 bg-transparent text-black">
      <div className="flex items-center">
        <button
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
          className="text-2xl"
        >
          <IoChevronBack />
        </button>
      </div>
    </header>
  );
}
