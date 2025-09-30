import Google from '@/assets/icons/google.svg';

type Props = {
  onClick: () => void;
};

export default function GoogleLoginButton({ onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="구글 로그인"
      className="relative w-full cursor-pointer rounded-[6px] border border-gray-20 bg-gray-0 py-[1.2rem] pl-[4.8rem] pr-[1.2rem] text-gray-900 hover:bg-gray-5/90"
    >
      <span className="pointer-events-none absolute left-[1.6rem] top-1/2 -translate-y-1/2">
        <img src={Google} alt="google" className="h-[2rem] w-[2rem]" />
      </span>

      <span className="block pr-[3rem] text-center bt3">구글 로그인</span>
    </button>
  );
}
