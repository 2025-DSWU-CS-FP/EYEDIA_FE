import { useEffect, useState } from 'react';

export default function HeaderWithScrollEffect() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 top-0 z-20 mx-auto w-full max-w-[430px] backdrop-blur-sm transition ${
        isScrolled ? 'bg-[#C9C9C9]/[0.64]' : 'bg-white'
      }`}
    >
      <div className="flex items-center justify-between px-5 py-4">
        <h1 className="text-xl font-semibold text-black">나의 전시</h1>
        <button type="button" aria-label="검색">
          <svg
            className="h-6 w-6 text-black"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M21 21l-4.35-4.35M16.5 10.5a6 6 0 11-12 0 6 6 0 0112 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
