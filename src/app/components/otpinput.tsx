'use client';
import { useRef } from 'react';

export default function OtpInput({ otp }: { otp: (value: string) => void }) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    otp(value);
    if (/^\d$/.test(value)) {
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    } else {
      e.target.value = '';
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === 'Backspace' && !e.currentTarget.value && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };
  return (
    <div className="flex justify-start gap-3 mt-4">
      {[...Array(6)].map((_, idx) => (
        <input
          key={idx}
          maxLength={1}
          ref={el => {
            inputsRef.current[idx] = el;
          }}
          onChange={e => handleChange(e, idx)}
          onKeyDown={e => handleKeyDown(e, idx)}
          className="w-10 h-10 md:w-14 md:h-14 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
      ))}
    </div>
  );
}
