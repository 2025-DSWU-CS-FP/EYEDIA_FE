interface SendIconProps {
  fill?: string;
  size?: number;
}

export default function SendIcon({
  fill = '#696969',
  size = 24,
}: SendIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask
        id="mask0"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="24"
        height="24"
      >
        <rect width="24" height="24" fill={fill} />
      </mask>
      <g mask="url(#mask0)">
        <path
          d="M14.0599 22.0672V10.1347L9.24736 14.9472L7.93018 13.6297L14.9974 6.5625L22.0646 13.6297L20.7474 14.9472L15.9349 10.1347V22.0672H14.0599Z"
          fill={fill}
        />
      </g>
    </svg>
  );
}
