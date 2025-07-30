import { InputHTMLAttributes } from 'react';

import cn from '@/utils/cn';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
}

export default function TextInput({
  errorMessage,
  className = 'text-bd2',
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
          'w-full rounded-[6px] bg-white px-[1.6rem] py-[1.2rem] text-gray-80 placeholder-gray-30 focus:outline-none focus:ring-2 focus:ring-brand-blue-light',
          className,
        )}
      />
      {errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
