import { Link, useLocation } from 'react-router-dom';

import GalleryIcon from '@/assets/icons/galleryIcon.svg?react';
import GalleryStrokeIcon from '@/assets/icons/gallerystrokeIcon.svg?react';
import HomeemptyIcon from '@/assets/icons/homeemptyIcon.svg?react';
import HomeIcon from '@/assets/icons/homeIcon.svg?react';
import ProfileFillIcon from '@/assets/icons/profilefillicon.svg?react';
import ProfileIcon from '@/assets/icons/profileIcon.svg?react';
import MapIcon from '@/components/Icons/MapIcon';

export default function NavigationBar() {
  const { pathname } = useLocation();

  const iconStyle = 'size-10';

  const menuList = [
    {
      title: '홈 이동',
      to: '/',
      icon:
        pathname === '/' ? (
          <HomeIcon className="size-9 fill-mainGreen" />
        ) : (
          <HomeemptyIcon className="size-9 stroke-mainGray" />
        ),
    },
    {
      title: '갤러리 이동',
      to: '/gallery',
      icon: pathname === '/gallery' ? <GalleryStrokeIcon /> : <GalleryIcon />,
    },
    {
      title: '지도 이동',
      to: '/map',
      icon: (
        <MapIcon
          className={iconStyle}
          stroke="#1C1B1F"
          strokeWidth={pathname === '/map' ? 0.8 : 0}
        />
      ),
    },
    {
      title: '마이페이지 이동',
      to: '/mypage',
      icon: pathname === '/mypage' ? <ProfileFillIcon /> : <ProfileIcon />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-10 flex w-full max-w-md items-center justify-around rounded-t-sm bg-[#F6F6F6] h-[70px] px-2">
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
