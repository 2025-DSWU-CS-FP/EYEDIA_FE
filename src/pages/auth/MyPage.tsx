import MenuList from '@/components/mypage/MenuList';
import MyPageHeader from '@/components/mypage/MyPageHeader';
import ProfileCard from '@/components/mypage/ProfileCard';

export default function MyPage() {
  const mockProfile = {
    name: '김아트',
    exhibitionCount: 6,
  };

  return (
    <div className="flex w-full flex-col">
      <MyPageHeader />
      <main className="flex flex-col gap-[2rem]">
        <ProfileCard
          name={mockProfile.name}
          exhibitionCount={mockProfile.exhibitionCount}
        />
        <MenuList />
      </main>
    </div>
  );
}
