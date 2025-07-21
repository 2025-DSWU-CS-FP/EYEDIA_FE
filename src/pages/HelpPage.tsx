import { useNavigate } from 'react-router-dom';

function HelpPage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center items-center h-[90vh] bg-lightGray px-4">
      <div className="fixed w-[350px] max-w-md bg-white/70 text-black shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">도움말</h1>
        <p className="text-base text-center mb-6 leading-relaxed">
          아이웨어 연결이 되지 않나요?
          <br />
          아래 내용을 확인해보세요.
        </p>
        <ul className="list-disc list-inside text-sm text-left space-y-2 mb-8">
          <li>블루투스가 켜져 있는지 확인해주세요.</li>
          <li>아이웨어 전원이 켜져 있는지 확인해주세요.</li>
          <li>블루투스 접근이 허용되어 있는지 확인하세요.</li>
          <li>그래도 안 된다면 기기를 재시작해보세요.</li>
        </ul>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full py-2 bg-black text-white rounded-md hover:bg-neutral-800 transition"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default HelpPage;
