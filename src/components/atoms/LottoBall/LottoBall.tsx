import { cn } from '@/lib/utils';

export interface LottoBallProps {
  number: number;
  size?: 'small' | 'medium' | 'large';
  isBonus?: boolean;
  className?: string;
}

export const LottoBall = ({ number, size = 'medium', isBonus = false, className }: LottoBallProps) => {
  const getNumberColor = (num: number) => {
    if (num <= 10) return "bg-yellow-500";
    if (num <= 20) return "bg-blue-500";
    if (num <= 30) return "bg-red-500";
    if (num <= 40) return "bg-gray-500";
    return "bg-green-500";
  };

  const sizeClasses = {
    small: 'w-10 h-10 text-sm',
    medium: 'w-16 h-16 text-xl',
    large: 'w-20 h-20 text-2xl'
  };

  const baseClasses = 'text-white rounded-2xl flex items-center justify-center font-bold shadow-lg transition-all duration-200 hover:scale-110';

  if (isBonus) {
    return (
      <div className={cn(
        baseClasses,
        sizeClasses[size],
        'bg-gradient-to-r from-yellow-400 to-yellow-500 border-4 border-yellow-400',
        className
      )}>
        {number}
      </div>
    );
  }

  return (
    <div className={cn(
      baseClasses,
      sizeClasses[size],
      getNumberColor(number),
      className
    )}>
      {number}
    </div>
  );
};