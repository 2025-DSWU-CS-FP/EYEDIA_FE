import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="mb-4 text-7xl font-extrabold text-gray-800">404</h1>
      <p className="mb-2 text-lg text-gray-600">페이지를 찾을 수 없어요</p>
      <p className="mb-6 text-sm text-gray-400">
        요청하신 페이지가 존재하지 않거나, 이동되었어요.
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
