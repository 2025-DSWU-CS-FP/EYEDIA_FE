import { Link } from 'react-router-dom';

import Logo from '@/assets/icons/logo.svg?react';

export default function Footer() {
  return (
    <footer className="flex flex-col items-start gap-[2.5rem] px-[2.5rem] py-6">
      <div className="flex flex-col gap-[0.8rem]">
        <div className="flex items-center gap-[0.8rem]">
          <Logo className="w-[4.8rem] text-gray-50" />
          <span className="text-t3 font-bold text-gray-50">EYEDIA</span>
        </div>
        <p className="text-ct4 text-gray-50">eyedia2025@gmail.com</p>
      </div>

      <div className="flex flex-col pb-[3rem]">
        <nav aria-label="legal" className="mb-[0.6rem]">
          <ul className="flex gap-[0.8rem] text-ct5 font-semibold">
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

        <p className="text-ct4 text-gray-50">
          © 2025 EYEDIA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
