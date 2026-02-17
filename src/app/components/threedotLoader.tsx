interface ThreeDotLoaderProps {
  variant?: 'white' | 'primary'; // add more variants as needed
}

export default function ThreeDotLoader({
  variant = 'primary',
}: ThreeDotLoaderProps) {
  const colorClass = variant === 'white' ? 'bg-white' : 'bg-[#FF385C]';

  return (
    <div className="flex items-center justify-center space-x-1">
      <span
        className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] ${colorClass}`}
      />
      <span
        className={`w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] ${colorClass}`}
      />
      <span className={`w-2 h-2 rounded-full animate-bounce ${colorClass}`} />
    </div>
  );
}
