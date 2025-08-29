import { useState, InputHTMLAttributes } from 'react';

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface PasswordInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  errorMessage?: string;
  id?: string;
}

export default function PasswordInput({
  errorMessage,
  placeholder,
  value,
  onChange,
  name,
  disabled,
  id,
}: PasswordInputProps) {
  const [showPw, setShowPw] = useState(false);

  return (
    <div className="relative w-full">
      <input
        id={id}
        type={showPw ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        name={name}
        disabled={disabled}
        className="w-full rounded-[6px] bg-white px-[1.6rem] py-[1.2rem] text-gray-80 placeholder-gray-30 ct3 focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
      />
      <button
        type="button"
        onClick={() => setShowPw(prev => !prev)}
        className="absolute right-[1rem] top-[1.2rem] text-gray-400 hover:text-gray-600"
        aria-label={showPw ? '비밀번호 숨기기' : '비밀번호 보기'}
      >
        {showPw ? (
          <AiOutlineEyeInvisible size={20} />
        ) : (
          <AiOutlineEye size={20} />
        )}
      </button>
      {errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
