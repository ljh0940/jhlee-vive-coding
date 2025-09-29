import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass';
  children: ReactNode;
}

export const Card = ({ variant = 'default', children, className, ...props }: CardProps) => {
  const variantClasses = {
    default: 'card',
    glass: 'card-glass'
  };

  return (
    <div className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </div>
  );
};