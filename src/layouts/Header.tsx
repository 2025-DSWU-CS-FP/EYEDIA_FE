import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  backgroundColorClass?: string;
}

export default function Header({
  title = '마이페이지',
  showBackButton = false,
  backgroundColorClass = 'bg-white',
}: HeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className={`sticky top-0 z-20 flex w-full items-center justify-between px-[1.6rem] py-[2rem] ${backgroundColorClass}`}
    >
      {showBackButton ? (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center justify-center"
        >
          <IoChevronBack className="text-gray-100" size={24} />
        </button>
      ) : (
        <div className="w-6" />
      )}
      <h1 className="flex-1 text-center text-t5 font-semibold text-gray-100">
        {title}
      </h1>
      <div className="w-6" />
    </header>
  );
}
