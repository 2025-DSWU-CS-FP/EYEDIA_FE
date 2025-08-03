import { useNavigate } from 'react-router-dom';

import Divider from '@/components/mypage/Divider';
import MenuItem from '@/components/mypage/MenuItem';
import { useConfirm } from '@/contexts/ConfirmContext';

export default function MenuList() {
  const navigate = useNavigate();
  const { showConfirm } = useConfirm();

  const handleLogoutClick = async () => {
    const confirmed = await showConfirm('로그아웃 하시겠습니까?');
    if (confirmed) {
      localStorage.removeItem('accessToken');

      navigate('/login');
    }
  };

  return (
    <nav className="flex w-full flex-col gap-[3rem] overflow-hidden px-[3.5rem] py-[2rem]">
      <MenuItem label="나의 뱃지" />
      <Divider />
      <MenuItem
        onClick={() => navigate('/terms-of-service')}
        label="서비스 이용약관"
      />
      <MenuItem
        onClick={() => navigate('/privacy')}
        label="개인정보 처리방침"
      />
      <MenuItem
        onClick={() => navigate('/edit-profile')}
        label="내 정보 수정"
      />
      <Divider />
      <MenuItem onClick={handleLogoutClick} label="로그아웃" />
    </nav>
  );
}
