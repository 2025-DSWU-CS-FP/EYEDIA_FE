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
        <div className="flex gap-[0.8rem] text-ct5 font-semibold">
          <span className="cursor-pointer py-[0.4rem] text-gray-60 hover:text-gray-70">
            개인정보처리방침
          </span>
          <span className="cursor-pointer py-[0.4rem] text-gray-60 hover:text-gray-70">
            이용약관
          </span>
        </div>
        <p className="text-ct4 text-gray-50">
          © 2025 EYEDIA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
