import { useNavigate } from 'react-router-dom';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white text-center">
      <h1 className="text-7xl font-extrabold text-[#E15D6A] mb-4">Error!</h1>
      <p className="text-lg text-gray-600 mb-2">
        페이지를 불러오는 중 오류가 발생했습니다.
      </p>
      <p className="text-sm text-gray-400 mb-6">
        요청한 페이지를 로드할 수 없습니다. 다시 시도하거나, 메인 페이지로
        이동하세요.
      </p>
      <button
        type="button"
        onClick={() => navigate('/')}
        className="bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
