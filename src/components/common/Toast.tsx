import CloseIcon from '@/assets/icons/toast-close.svg?react';
import InfoIcon from '@/assets/icons/toast-info.svg?react';
import SuccessIcon from '@/assets/icons/toast-success.svg?react';

export type ToastType = 'success' | 'info' | 'error';

interface ToastProps {
  type: ToastType;
  message: string;
}

const toastStyles = {
  success: {
    icon: <SuccessIcon className="w-[1rem] text-white" />,
    iconBg: 'bg-brand-blue',
    bg: 'bg-gray-50',
  },
  info: {
    icon: <InfoIcon className="h-[1.1rem] text-white" />,
    iconBg: 'bg-[#DCA048]',
    bg: 'bg-gray-50',
  },
  error: {
    icon: <CloseIcon className="w-[1.1rem] text-white" />,
    iconBg: 'bg-[#FF5656]',
    bg: 'bg-gray-50',
  },
};

export default function Toast({ type, message }: ToastProps) {
  const { icon, iconBg, bg } = toastStyles[type];

  return (
    <div
      className={`inline-flex w-full items-center gap-[0.8rem] rounded-[8px] px-[1.6rem] py-[1.2rem] shadow-md ${bg}`}
    >
      <div
        className={`flex h-[20px] w-[20px] items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </div>
      <span className="text-ct3 font-medium text-white">{message}</span>
    </div>
  );
}
