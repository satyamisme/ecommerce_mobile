import { cn } from '../../utils/cn';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export default function LoadingSpinner({ size = 'medium', className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent',
        {
          'h-4 w-4': size === 'small',
          'h-8 w-8': size === 'medium',
          'h-12 w-12': size === 'large',
        },
        'text-primary-500',
        className
      )}
    />
  );
}