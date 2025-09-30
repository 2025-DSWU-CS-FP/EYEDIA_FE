import Naver from '@/assets/icons/naver.svg';

type Props = {
  onClick: () => void;
};

export default function NaverLoginButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="네이버 로그인"
      className="relative w-full cursor-pointer rounded-[6px] bg-[#03C75A] py-[1.2rem] pl-[4.8rem] pr-[1.2rem] text-gray-0 hover:opacity-90"
    >
      <span className="pointer-events-none absolute left-[1.6rem] top-1/2 -translate-y-1/2">
        <img src={Naver} alt="naver" className="h-[2rem] w-[2rem]" />
      </span>
      <span className="block pr-[3rem] text-center bt3">네이버 로그인</span>
    </button>
  );
}
