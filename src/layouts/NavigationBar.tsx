import { Link, useLocation } from 'react-router-dom';

import GalleryIcon from '@/assets/icons/galleryIcon.svg?react';
import HomeIcon from '@/assets/icons/homeIcon.svg?react';
import ProfileIcon from '@/assets/icons/profileIcon.svg?react';

export default function NavigationBar() {
  const { pathname } = useLocation();

  const iconStyle = 'size-7';

  const menuList = [
    {
      title: '홈',
      to: '/',
      icon: <HomeIcon className={iconStyle} />,
    },
    {
      title: '갤러리',
      to: '/gallery',
      icon: <GalleryIcon className={iconStyle} />,
    },
    {
      title: '내 정보',
      to: '/mypage',
      icon: <ProfileIcon className={iconStyle} />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 z-10 flex h-[70px] w-full max-w-[430px] -translate-x-1/2 items-center justify-around rounded-t-sm bg-white px-2">
      {menuList.map(menu => {
        const isActive = pathname === menu.to;
        return (
          <Link
            key={menu.to}
            to={menu.to}
            title={menu.title}
            className="flex flex-col items-center justify-center gap-[0.2rem]"
          >
            <span
              className={`${isActive ? 'text-[#424242]' : 'text-[#B0B8BF]'}`}
            >
              {menu.icon}
            </span>
            <span
              className={`ct4 ${
                isActive ? 'text-[#424242]' : 'text-[#B0B8BF]'
              }`}
            >
              {menu.title}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
