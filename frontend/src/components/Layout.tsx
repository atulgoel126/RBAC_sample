import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout: React.FC = () => {
  // Get username and roles along with auth state and logout function
  const { isAuthenticated, logout, username, roles } = useAuth();

  // Basic button style using Tailwind classes
  const buttonBaseStyle = "py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2";
  const primaryButtonStyle = `${buttonBaseStyle} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500`; // Changed to indigo to match forms
  const secondaryButtonStyle = `${buttonBaseStyle} bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500`;
  const logoutButtonStyle = `${buttonBaseStyle} bg-red-500 text-white hover:bg-red-600 focus:ring-red-400`; // New style for logout
  const linkStyle = "text-indigo-600 hover:text-indigo-800 hover:underline"; // Changed to indigo

  return (
    <div className="min-h-screen flex flex-col"> {/* Ensure layout takes full height */}
      <header className="bg-gray-100 border-b border-gray-300 shadow-sm">
        <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Left side navigation */}
          <div className="space-x-4">
            <Link to="/" className={linkStyle}>Home</Link>
            {isAuthenticated && (
              <Link to="/dashboard" className={linkStyle}>Dashboard</Link>
            )}
            {/* Add other main navigation links here */}
          </div>
          
          {/* Right side actions */}
          <div className="space-x-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className={linkStyle}>Login</Link>
                <Link to="/register" className={primaryButtonStyle}>Register</Link>
              </>
            ) : (
              <div className="flex items-center space-x-4"> {/* Container for user info and logout */}
                {username && (
                  <span className="text-gray-700"> {/* Container for user text */}
                    Username: <span className="font-medium">{username}</span>
                    {/* Display roles if they exist */}
                    {roles && roles.length > 0 && (
                      <span className="ml-2">Roles: <span className="font-medium text-sm text-gray-600">{roles.join(', ')}</span></span>
                    )}
                  </span>
                )}
                <button onClick={logout} className={logoutButtonStyle}>Logout</button> {/* Use logoutButtonStyle */}
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Main content area grows to fill space */}
      <main className="flex-grow container mx-auto px-4 py-6"> 
        <Outlet /> {/* Child routes will be rendered here */}
      </main>

      <footer className="bg-gray-200 border-t border-gray-300 mt-8 py-4 text-center text-gray-600 text-sm">
        <p>&copy; {new Date().getFullYear()} RBAC Sample App</p>
      </footer>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Layout;