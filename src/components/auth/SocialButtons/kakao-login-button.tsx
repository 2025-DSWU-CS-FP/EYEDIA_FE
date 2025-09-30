import Kakao from '@/assets/icons/kakao.svg';

type Props = {
  onClick: () => void;
};

export default function KakaoLoginButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="카카오 로그인"
      className="relative w-full cursor-pointer rounded-[6px] bg-[#FEE500] py-[1.2rem] pl-[4.8rem] pr-[1.2rem] text-gray-90 hover:opacity-90"
    >
      <span className="pointer-events-none absolute left-[1.6rem] top-1/2 -translate-y-1/2">
        <img src={Kakao} alt="google" className="h-[2rem] w-[2rem]" />
      </span>

      <span className="block pr-[3rem] text-center bt3">카카오 로그인</span>
    </button>
  );
}
