// Common Tailwind style constants for reuse across components

// Links
export const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline";

// Forms
export const errorTextStyle = "mt-1 text-xs text-red-600";
export const formInputStyle = "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"; // Base style from Input component
export const formLabelStyle = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-1"; // Base style from Label component + margin bottom

// Tables
export const thStyle = "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
export const tdStyle = "px-4 py-2 whitespace-nowrap text-sm text-gray-700";
export const trStyle = "border-b border-gray-200 hover:bg-gray-50";

// Add other common styles here as needed