import Logo from '@/assets/icons/logo.svg?react';

export default function Footer() {
  return (
    <footer className="flex flex-col items-start px-[2.5rem] py-6 gap-[2.5rem]">
      <div className="flex flex-col gap-[0.8rem]">
        <div className="flex items-center gap-[0.8rem]">
          <Logo className="text-gray-50 w-[4.8rem]" />
          <span className="text-gray-50 text-t3 font-bold">EYEDIA</span>
        </div>
        <p className="text-gray-50 text-ct4">eyedia2025@gmail.com</p>
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
        <p className="text-gray-50 text-ct4">
          © 2025 EYEDIA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
