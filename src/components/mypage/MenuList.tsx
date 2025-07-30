import Divider from './Divider';
import MenuItem from './MenuItem';

export default function MenuList() {
  return (
    <nav className="flex w-full flex-col gap-[3rem] overflow-hidden px-[3.5rem] py-[2rem]">
      <MenuItem label="나의 뱃지" />
      <Divider />
      <MenuItem label="서비스 이용약관" />
      <MenuItem label="개인정보 처리방침" />
      <MenuItem label="앱 설정" />
      <Divider />
      <MenuItem label="로그아웃" />
    </nav>
  );
}
