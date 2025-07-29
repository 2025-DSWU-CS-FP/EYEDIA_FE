import { InputHTMLAttributes } from 'react';

import cn from '@/utils/cn';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

export default function TextInput({
  errorMessage,
  className,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled,
  name,
}: TextInputProps) {
  return (
    <div className="w-full">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        name={name}
        className={cn(
          'w-full px-[1.6rem] py-[1.2rem] rounded-[6px] bg-white text-gray-80 placeholder-gray-30 focus:outline-none focus:ring-2 focus:ring-brand-blue-light',
          className,
        )}
      />
      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
}
