import { cn } from '@/lib/utils';

export interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const Logo = ({ size = 'medium', className }: LogoProps) => {
  const sizeMap = {
    small: 60,
    medium: 80,
    large: 120
  };

  return (
    <div className={cn('logo-container', className)}>
      <img
        src="/icons/app-logo.svg"
        alt="Lucky Numbers"
        width={sizeMap[size]}
        height={sizeMap[size]}
      />
    </div>
  );
};