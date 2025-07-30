import { useNavigate } from 'react-router-dom';

function HelpPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-lightGray flex h-[90vh] items-center justify-center px-4">
      <div className="fixed w-[350px] max-w-md rounded-xl bg-white/70 p-6 text-black shadow-lg">
        <h1 className="mb-4 text-center text-2xl font-bold">도움말</h1>
        <p className="mb-6 text-center text-base leading-relaxed">
          아이웨어 연결이 되지 않나요?
          <br />
          아래 내용을 확인해보세요.
        </p>
        <ul className="mb-8 list-inside list-disc space-y-2 text-left text-sm">
          <li>블루투스가 켜져 있는지 확인해주세요.</li>
          <li>아이웨어 전원이 켜져 있는지 확인해주세요.</li>
          <li>블루투스 접근이 허용되어 있는지 확인하세요.</li>
          <li>그래도 안 된다면 기기를 재시작해보세요.</li>
        </ul>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full rounded-md bg-black py-2 text-white transition hover:bg-neutral-800"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}

export default HelpPage;
