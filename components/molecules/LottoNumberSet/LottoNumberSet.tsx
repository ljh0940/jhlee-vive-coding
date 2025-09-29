import { LottoBall } from '@/components/atoms/LottoBall';
import { cn } from '@/lib/utils';

export interface LottoNumberSetProps {
  numbers: number[];
  bonusNumber?: number;
  size?: 'small' | 'medium' | 'large';
  showDivider?: boolean;
  className?: string;
}

export const LottoNumberSet = ({
  numbers,
  bonusNumber,
  size = 'medium',
  showDivider = true,
  className
}: LottoNumberSetProps) => {
  return (
    <div className={cn('flex items-center flex-wrap gap-2', className)}>
      {numbers.map((num, index) => (
        <LottoBall key={index} number={num} size={size} />
      ))}

      {bonusNumber && (
        <>
          {showDivider && <div className="mx-1 text-gray-400 text-sm">+</div>}
          <LottoBall number={bonusNumber} size={size} isBonus />
        </>
      )}
    </div>
  );
};