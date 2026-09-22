import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-dark">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={`
            w-full px-4 py-3 border-2 border-gray-200 rounded-lg
            focus:outline-none focus:border-primary-300 focus:ring-2 focus:ring-primary-100
            transition-all duration-200
            placeholder:text-gray-400
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-100' : ''}
            ${className || ''}
          `}
          {...props}
        />
        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
        {helperText && !error && <p className="text-sm text-gray-500">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
