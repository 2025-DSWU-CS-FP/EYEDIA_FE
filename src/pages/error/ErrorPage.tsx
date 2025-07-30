import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="mb-4 text-7xl font-extrabold text-[#E15D6A]">Error!</h1>
      <p className="mb-2 text-lg text-gray-600">
        페이지를 불러오는 중 오류가 발생했습니다.
      </p>
      <p className="mb-6 text-sm text-gray-400">
        요청한 페이지를 로드할 수 없습니다. 다시 시도하거나, 메인 페이지로
        이동하세요.
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
