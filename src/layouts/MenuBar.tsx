import { useState } from 'react';

import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute right-4 top-4 z-50 hidden md:block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="메뉴 열기"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded bg-white/30 shadow-md">
          <ul className="flex flex-col">
            <li>
              <Link to="/" className="hover:bg-darkGray block px-4 py-2">
                홈
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="hover:bg-darkGray block px-4 py-2">
                갤러리
              </Link>
            </li>
            <li>
              <Link to="/map" className="hover:bg-darkGray block px-4 py-2">
                지도
              </Link>
            </li>
            <li>
              <Link to="/mypage" className="hover:bg-darkGray block px-4 py-2">
                마이페이지
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
