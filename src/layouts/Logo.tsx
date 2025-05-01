import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'large';
}

export default function Logo({ size = 'small' }: LogoProps) {
  const sizeClasses = {
    small: 'size-[40px]',
    large: 'size-[90px]',
  };

  return (
    <Link
      to="/"
      title="메인 페이지 이동"
      className={`flex items-center justify-center rounded-full ${sizeClasses[size]}`}
    >
      <img
        src="" // TODO: 추후 추가
        alt="Eyedia 로고"
        className="h-full w-full object-cover"
      />
    </Link>
  );
}
