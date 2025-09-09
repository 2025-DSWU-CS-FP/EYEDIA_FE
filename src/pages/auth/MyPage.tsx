import { useEffect, useState } from 'react';

import MenuList from '@/components/mypage/MenuList';
import ProfileCard from '@/components/mypage/ProfileCard';
import Header from '@/layouts/Header';

export default function MyPage() {
  const [userName, setUserName] = useState('');
  useEffect(() => {
    try {
      const nameRaw = (localStorage.getItem('name') ?? '').trim();
      setUserName(nameRaw || '사용자');
    } catch {
      setUserName('사용자');
    }
  }, []);
  const mockProfile = {
    userName,
    exhibitionCount: 6,
  };

  return (
    <div className="flex w-full flex-col">
      <Header title="마이페이지" />
      <main className="flex flex-col gap-[2rem]">
        <ProfileCard
          name={mockProfile.userName}
          exhibitionCount={mockProfile.exhibitionCount}
        />
        <MenuList />
      </main>
    </div>
  );
}
