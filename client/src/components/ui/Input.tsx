import type { InputHTMLAttributes } from 'react';

export const inputClasses = 'mt-2 h-10 w-full rounded-lg border border-border bg-white px-3 text-sm outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100';

export default function Input({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputClasses} ${className}`} />;
}
