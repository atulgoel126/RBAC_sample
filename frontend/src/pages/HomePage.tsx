import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // Button styles from Layout (or define similar ones)
  const buttonBaseStyle = "inline-block py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out";
  const primaryButtonStyle = `${buttonBaseStyle} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
  const secondaryLinkStyle = "text-blue-600 hover:text-blue-800 hover:underline font-medium";

  return (
    <div className="text-center p-8 md:p-12 bg-gray-50 rounded-lg shadow-sm"> {/* Centered text, padding, background */}
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the RBAC Sample App</h1>
      <p className="text-lg text-gray-600 mb-6">
        This application demonstrates Role-Based Access Control (RBAC) concepts
        implemented with a Spring Boot backend and a React frontend.
      </p>
      
      <div className="mt-8 space-y-4"> {/* Add spacing for CTAs */}
        {!isAuthenticated ? (
          <div>
            <p className="text-gray-700 mb-4">Get started by logging in or creating an account:</p>
            <div className="space-x-4"> {/* Spacing between buttons */}
              <Link to="/login" className={secondaryLinkStyle}>Login</Link>
              <Link to="/register" className={primaryButtonStyle}>Register</Link>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-gray-700 mb-4">You are currently logged in.</p>
            <Link to="/dashboard" className={primaryButtonStyle}>Go to Dashboard</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;