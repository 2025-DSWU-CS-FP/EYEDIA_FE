import { InputHTMLAttributes } from 'react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string;
  id?: string;
}

export default function TextInput({
  errorMessage,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled,
  name,
  id,
}: TextInputProps) {
  return (
    <div className="w-full">
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        name={name}
        className="w-full rounded-[6px] bg-white px-[1.6rem] py-[1.2rem] text-ct3 text-gray-80 placeholder-gray-30 focus:outline-none focus:ring-2 focus:ring-brand-blue-light"
      />
      {errorMessage && (
        <p className="mt-1 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
}
