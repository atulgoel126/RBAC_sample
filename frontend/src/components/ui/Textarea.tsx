import * as React from 'react';

// Define props interface, extending standard textarea attributes
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean; // Add optional error prop
}

// Create the Textarea component
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => { // Destructure error prop
    // Base textarea styles using Tailwind
    const baseStyle =
      'flex min-h-[80px] w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    // Conditional error styles
    const errorStyle = error
      ? 'border-red-500 focus-visible:ring-red-500'
      : 'border-gray-300 focus-visible:ring-indigo-500';

    // Combine styles
    const combinedClassName = `${baseStyle} ${errorStyle} ${className || ''}`;

    return (
      <textarea
        className={combinedClassName.trim()}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };