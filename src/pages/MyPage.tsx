import Footer from '@/components/mypage/Footer';
import MenuList from '@/components/mypage/MenuList';
import MyPageHeader from '@/components/mypage/MyPageHeader';
import ProfileCard from '@/components/mypage/ProfileCard';

export default function MyPage() {
  const mockProfile = {
    name: '김아트',
    exhibitionCount: 6,
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-neutral-100">
      <MyPageHeader />
      <main className="flex flex-col flex-1 gap-8">
        <ProfileCard
          name={mockProfile.name}
          exhibitionCount={mockProfile.exhibitionCount}
        />
        <MenuList />
      </main>
      <Footer />
    </div>
  );
}
