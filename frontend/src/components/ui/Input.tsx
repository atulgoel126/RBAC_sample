import * as React from 'react';

// Define props interface, extending standard input attributes
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean; // Add optional error prop
}

// Create the Input component
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => { // Destructure error prop
    // Base input styles using Tailwind
    const baseStyle =
      'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    // Conditional error styles
    const errorStyle = error
      ? 'border-red-500 focus-visible:ring-red-500'
      : 'border-gray-300 focus-visible:ring-indigo-500';

    // Combine styles
    const combinedClassName = `${baseStyle} ${errorStyle} ${className || ''}`;

    return (
      <input
        type={type}
        className={combinedClassName.trim()}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };