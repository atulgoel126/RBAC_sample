import React from 'react';

interface FormErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode;
}

const FormErrorMessage = React.forwardRef<
  HTMLParagraphElement,
  FormErrorMessageProps
>(({ className, children, ...props }, ref) => {
  if (!children) {
    return null; // Don't render if there's no message
  }

  // Base styles using Tailwind
  const baseStyle = "mt-1 text-xs text-red-600";

  // Combine base styles with any additional classes passed via props
  const combinedClassName = `${baseStyle} ${className || ''}`;

  return (
    <p ref={ref} className={combinedClassName.trim()} {...props}>
      {children}
    </p>
  );
});

FormErrorMessage.displayName = 'FormErrorMessage';

export { FormErrorMessage };