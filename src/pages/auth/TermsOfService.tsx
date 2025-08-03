import Header from '@/layouts/Header';

function TermsOfService() {
  return (
    <div>
      <Header
        title="서비스 이용방침"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />
      <div className="px-[2.4rem] py-[4rem] text-left">
        <h1 className="mb-[2rem] text-[2rem] font-bold">서비스 이용방침</h1>
        <p className="whitespace-pre-line text-[1.4rem] leading-[180%] text-gray-70">
          {`
본 이용약관은 Eyedia 서비스의 이용과 관련하여 사용자와 Eyedia 간의 권리, 의무 및 책임사항을 규정합니다.

1. 서비스 목적: 사용자의 전시 감상 경험 향상 및 정보 제공
2. 이용 조건: 회원가입 후 본 서비스 이용 가능
3. 금지 사항: 타인의 권리 침해, 서비스 악용, 불법 콘텐츠 업로드 등
4. 책임 제한: 서비스 오류로 인한 손해에 대해 Eyedia는 고의 또는 중대한 과실이 없는 한 책임을 지지 않습니다.
5. 약관 변경: Eyedia는 필요 시 본 약관을 수정할 수 있으며, 변경사항은 공지 후 적용됩니다.

보다 나은 서비스를 위해 항상 노력하겠습니다.
        `}
        </p>
      </div>
    </div>
  );
}

export default TermsOfService;
