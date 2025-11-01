import Link from 'next/link';
import { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  href, 
  className = '', 
  ...props 
}: ButtonProps) => {
  const baseClasses = 'font-medium transition-colors inline-flex items-center justify-center';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-white hover:bg-gray-50 text-blue-700 border border-blue-600',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-lg',
  };
  
  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );
  
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

export default Button;