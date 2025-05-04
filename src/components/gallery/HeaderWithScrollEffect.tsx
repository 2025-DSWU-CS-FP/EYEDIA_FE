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
      className={`fixed top-0 left-0 right-0 z-20 mx-auto max-w-[375px] transition backdrop-blur-sm ${
        isScrolled ? 'bg-[#C9C9C9]/[0.64]' : 'bg-white'
      }`}
    >
      <div className="px-5 py-4 flex justify-between items-center">
        <h1 className="text-xl text-black font-semibold">나의 전시</h1>
        <button type="button" aria-label="검색">
          <svg
            className="w-6 h-6 text-black"
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
