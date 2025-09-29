import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, ...props }, ref) => {
    return (
      <div className="form-group">
        {label && (
          <label htmlFor={props.id} className="form-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'input-field',
            error && 'border-red-300 focus:border-red-300 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <div className="form-error">{error}</div>}
        {helperText && !error && (
          <div className="text-sm text-gray-500">{helperText}</div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';