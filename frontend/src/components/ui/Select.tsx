import * as React from 'react';

// Define the structure for each option
interface SelectOption {
  value: string | number;
  label: string;
}

// Define props interface, extending standard select attributes
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
  error?: boolean; // Add optional error prop
}

// Create the Select component
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, placeholder, error, ...props }, ref) => { // Destructure error prop
    // Base select styles using Tailwind
    const baseStyle =
      'flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none';

    // Conditional error styles
    const errorStyle = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:ring-indigo-500';

    // Combine styles
    const combinedClassName = `${baseStyle} ${errorStyle} ${className || ''}`;

    return (
      <div className="relative w-full">
        <select
          className={combinedClassName.trim()}
          ref={ref}
          {...props}
        >
          {/* Add a default placeholder option if the placeholder prop is provided */}
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {/* Map over the options array to create <option> elements */}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Add a dropdown arrow indicator */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M5.516 7.548c.436-.446 1.043-.481 1.576 0L10 10.405l2.908-2.857c.533-.481 1.14-.446 1.574 0 .436.445.408 1.197 0 1.615l-3.71 3.91c-.533.564-1.408.564-1.942 0l-3.71-3.91c-.408-.418-.436-1.17 0-1.615z"/>
          </svg>
        </div>
      </div>
    );
  }
);
Select.displayName = 'Select';

export { Select };