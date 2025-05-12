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
    <div className="padding-b-[10px] fixed bottom-0 mx-auto flex h-full max-h-[70px] w-full max-w-[400px] items-center justify-center gap-8 rounded-t-sm bg-[#F6F6F6]">
      {' '}
      {/* TODO: md:hidden 추가하기 */}
      {menuList.map(menu => (
        <Link
          key={menu.to}
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
