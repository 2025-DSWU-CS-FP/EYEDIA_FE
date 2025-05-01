import { Link, useLocation } from 'react-router-dom';

import GalleryIcon from '@/assets/icons/galleryIcon.svg?react';
import HomeIcon from '@/assets/icons/homeIcon.svg?react';
import MapIcon from '@/assets/icons/mapIcon.svg?react';
import ProfileIcon from '@/assets/icons/profileIcon.svg?react';

export default function NavigationBar() {

  const { pathname } = useLocation();

  const iconStyle = 'size-10';

  const menuList = [
    {
      title: '홈 이동',
      to: '/',
      icon: (
        <HomeIcon
          className={`${iconStyle} ${pathname === '/' ? 'fill-mainGreen' : 'fill-mainGray'}`}
        />
      ),
    },
    {
      title: '갤러리 이동',
      to: '/gallery',
      icon: (
        <GalleryIcon
          className={`${iconStyle} ${pathname === '/gallery' ? 'stroke-mainGreen [&>path:first-child]:fill-mainGreen' : 'stroke-mainGray [&>path:first-child]:fill-mainGray'}`}
        />
      ),
    },
    {
      title: '지도 이동',
      to: '/map',
      icon: (
        <MapIcon
          className={`${iconStyle} ${pathname === '/map' ? 'fill-mainGreen' : 'fill-mainGray'}`}
        />
      ),
    },
    {
      title: '마이페이지 이동',
      to: '/mypage',
      icon: (
        <ProfileIcon
          className={`${iconStyle} size-9 ${pathname === '/mypage' ? 'stroke-mainGreen [&>path:first-child]:fill-mainGreen' : 'stroke-mainGray [&>path:first-child]:fill-mainGray'}`}
        />
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-[375px] mx-auto h-[58px] bg-white rounded-t-2xl shadow-[0px_-1px_20px_0px_rgba(28,30,32,0.08)] flex justify-center items-center gap-8">
        {menuList.map(menu => (
            <Link
              to={menu.to}
              title={menu.title}
              className="flex size-10 items-center justify-center"
            >
              {menu.icon}
            </Link>
        ))}
    </div>
  );
}
