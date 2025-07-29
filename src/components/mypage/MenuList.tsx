import Divider from './Divider';
import MenuItem from './MenuItem';

export default function MenuList() {
  return (
    <nav className="flex flex-col w-full overflow-hidden gap-[3rem] px-[3.5rem] py-[2rem]">
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
