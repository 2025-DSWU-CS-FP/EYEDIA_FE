import Header from '@/layouts/Header';

function PrivacyPolicy() {
  return (
    <div>
      <Header
        title="개인정보 처리방침"
        showBackButton
        backgroundColorClass="bg-gray-5"
      />
      <div className="px-[2.4rem] py-[4rem] text-left">
        <h1 className="mb-[2rem] text-[2rem] font-bold">개인정보 처리방침</h1>
        <p className="whitespace-pre-line text-[1.4rem] font-medium leading-[180%] text-gray-70">
          {`
Eyedia는 이용자의 개인정보를 소중히 여기며, 관련 법령에 따라 아래와 같이 처리하고 있습니다.

1. 수집 항목: 이름, 이메일, 서비스 이용기록 등
2. 수집 목적: 서비스 제공, 문의 응대, 통계 분석 등
3. 보관 기간: 회원 탈퇴 시까지 또는 법령이 정한 보관 기간
4. 제3자 제공: 없음
5. 개인정보 보호책임자: eyedia2025@gmail.com

자세한 사항은 고객센터를 통해 문의 바랍니다.
        `}
        </p>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
