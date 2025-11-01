import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

const Card = ({ children, className = '', variant = 'default' }: CardProps) => {
  const variantClasses = {
    default: 'bg-white border border-gray-200',
    elevated: 'bg-white shadow-sm',
    outlined: 'bg-transparent border-2 border-gray-300',
  };

  return (
    <div className={cn('rounded-xl', variantClasses[variant], className)}>
      {children}
    </div>
  );
};

export default Card;