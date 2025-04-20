import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button } from './ui/Button'; // Import the reusable Button

const Layout: React.FC = () => {
  // Get username and roles along with auth state and logout function
  const { isAuthenticated, logout, username, roles } = useAuth();

  // Removed old button style constants
  const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline"; // Keep link style

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
          <div className="space-x-4 flex items-center"> {/* Ensure items are vertically centered */}
            {!isAuthenticated ? (
              <>
                <Link to="/login" className={linkStyle}>Login</Link>
                {/* Use Button component inside Link for Register */}
                <Link to="/register">
                    <Button variant="primary" size="sm">Register</Button>
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-4"> {/* Container for user info and logout */}
                {username && (
                  <span className="text-sm text-gray-700"> {/* Adjusted text size */}
                    User: <span className="font-medium">{username}</span>
                    {/* Display roles if they exist - Corrected JSX */}
                    {roles && roles.length > 0 ? (
                      <span className="ml-2">Roles: <span className="font-medium text-xs text-gray-600">{roles.join(', ')}</span></span>
                    ) : null}
                  </span>
                )}
                {/* Use Button component for Logout - Corrected variant */}
                <Button onClick={logout} variant="danger" size="sm">Logout</Button>
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