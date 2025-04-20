import React from 'react';

// Define props interface
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  // Add other potential props like title, footer, etc. if needed later
}

// Create the Card component
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    // Base card styles using Tailwind
    const baseStyle =
      'block rounded-lg border border-gray-200 bg-white shadow-md transition duration-150 ease-in-out'; // Basic card style, removed hover for base

    // Combine base styles with any additional classes passed via props
    const combinedClassName = `${baseStyle} ${className || ''}`;

    return (
      <div ref={ref} className={combinedClassName.trim()} {...props}>
        {children}
      </div>
    );
  }
);
Card.displayName = 'Card';

// Optional: Export sub-components for Card structure if needed later
// export const CardHeader = ...
// export const CardContent = ...
// export const CardFooter = ...

export { Card };