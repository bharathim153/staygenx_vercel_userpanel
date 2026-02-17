import ThreeDotLoader from '@/app/components/threedotLoader';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'pink' | 'gray' | 'black' | 'transparent' | 'transparent2';
  loading?: boolean;
};

const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  pink: 'bg-[#FF385C] text-white',
  gray: 'bg-gray-100 text-black',
  black: 'bg-black text-white',
  transparent: 'bg-transparent text-black',
  transparent2: 'bg-transparent text-white',
};

export default function Button({
  children,
  className = 'inline-flex items-center justify-center rounded-md px-4 py-2',
  variant = 'transparent',
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const bgStyle = variantStyles[variant];

  return (
    <button
      className={`${bgStyle} ${className} ${loading ? 'h-[50px]' : ''} ${isDisabled ? 'opacity-60 cursor-not-allowed z-0 ' : 'cursor-pointer'} transform transition-transform duration-200 ease-in-out `}
      disabled={isDisabled}
      {...props}
    >
      {loading ? <ThreeDotLoader variant="white" /> : children}
    </button>
  );
}
