import { Link } from 'react-router-dom';

import Logo from '@/assets/icons/logo.svg?react';

export default function Footer() {
  return (
    <footer className="flex flex-col items-start gap-[2.5rem] px-[2.5rem] py-6">
      <div className="flex flex-col gap-[0.8rem]">
        <div className="flex items-center gap-[0.8rem]">
          <Logo className="w-[4.8rem] text-gray-50" />
          <span className="font-bold text-gray-50 t3">EYEDIA</span>
        </div>
        <p className="text-gray-50 ct4">eyedia2025@gmail.com</p>
      </div>

      <div className="flex flex-col pb-[3rem]">
        <nav aria-label="legal" className="mb-[0.6rem]">
          <ul className="flex gap-[0.8rem] font-semibold ct5">
            <li>
              <Link
                to="/privacy"
                className="inline-block py-[0.4rem] text-gray-60 hover:text-gray-70 focus:underline focus:outline-none"
              >
                개인정보처리방침
              </Link>
            </li>
            <li>
              <Link
                to="/terms-of-service"
                className="inline-block py-[0.4rem] text-gray-60 hover:text-gray-70 focus:underline focus:outline-none"
              >
                이용약관
              </Link>
            </li>
          </ul>
        </nav>

        <p className="text-gray-50 ct4">© 2025 EYEDIA. All rights reserved.</p>
      </div>
    </footer>
  );
}
