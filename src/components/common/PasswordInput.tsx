import { useState, InputHTMLAttributes } from 'react';

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

import cn from '@/utils/cn';

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  errorMessage?: string;
}

export default function PasswordInput({
  errorMessage,
  className,
  placeholder,
  value,
  onChange,
  name,
  disabled,
}: PasswordInputProps) {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="w-full relative">
      <input
        type={showPw ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        disabled={disabled}
        className={cn(
          'w-full px-[1.6rem] py-[1.2rem] rounded-[6px] bg-white text-ct3 text-gray-80 placeholder-gray-30 focus:outline-none focus:ring-2 focus:ring-brand-blue-light',
          className,
        )}
      />
      <button
        type="button"
        onClick={() => setShowPw(prev => !prev)}
        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
      >
        {showPw ? (
          <AiOutlineEyeInvisible size={20} />
        ) : (
          <AiOutlineEye size={20} />
        )}
      </button>
      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
