import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const variantClass = {
      primary: 'bg-gradient-to-b from-primary-600 to-primary-700 text-white border border-primary-800/50 hover:from-primary-700 hover:to-primary-800 active:scale-95 shadow-md hover:shadow-lg',
      secondary: 'bg-white text-primary-700 border-2 border-primary-300 hover:bg-primary-50',
      ghost: 'text-primary-700 hover:bg-primary-50',
    }[variant];

    const sizeClass = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-5 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    }[size];

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center font-serif font-light rounded-lg
          transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClass} ${sizeClass} ${className || ''}
        `}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="animate-spin mr-2">⟳</span>
            Procesando...
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
