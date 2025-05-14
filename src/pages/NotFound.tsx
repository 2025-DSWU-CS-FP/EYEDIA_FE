import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-white text-center">
      <h1 className="text-7xl font-extrabold text-gray-800 mb-4">404</h1>
      <p className="text-lg text-gray-600 mb-2">페이지를 찾을 수 없어요</p>
      <p className="text-sm text-gray-400 mb-6">
        요청하신 페이지가 존재하지 않거나, 이동되었어요.
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
