import { useState } from 'react';

import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="hidden md:block absolute top-4 right-4 z-50">
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
              <Link to="/" className="block px-4 py-2 hover:bg-darkGray">
                홈
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="block px-4 py-2 hover:bg-darkGray">
                갤러리
              </Link>
            </li>
            <li>
              <Link to="/map" className="block px-4 py-2 hover:bg-darkGray">
                지도
              </Link>
            </li>
            <li>
              <Link to="/mypage" className="block px-4 py-2 hover:bg-darkGray">
                마이페이지
              </Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
