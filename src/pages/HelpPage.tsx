import { useNavigate } from 'react-router-dom';

function HelpPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white text-black px-6">
      <h1 className="text-2xl font-bold mb-4">도움말</h1>
      <p className="text-center text-base mb-8">
        아이웨어 연결이 되지 않나요?
        <br />
        아래 내용을 확인해보세요.
      </p>
      <ul className="text-sm list-disc list-inside text-left mb-8">
        <li>블루투스가 켜져 있는지 확인해주세요.</li>
        <li>아이웨어 전원이 켜져 있는지 확인해주세요.</li>
        <li>앱 권한 설정에서 블루투스 접근이 허용되어 있는지 확인하세요.</li>
        <li>그래도 안 된다면 기기를 재시작해보세요.</li>
      </ul>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="px-4 py-2 bg-black text-white rounded-md"
      >
        돌아가기
      </button>
    </div>
  );
}

export default HelpPage;
