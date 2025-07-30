import MenuList from '@/components/mypage/MenuList';
import ProfileCard from '@/components/mypage/ProfileCard';
import Header from '@/layouts/Header';

export default function MyPage() {
  const mockProfile = {
    name: '김아트',
    exhibitionCount: 6,
  };

  return (
    <div className="flex w-full flex-col">
      <Header />
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
