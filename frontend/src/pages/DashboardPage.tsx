import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DashboardPage: React.FC = () => {
  const { username, roles } = useAuth(); // Get user details from context

  // Tailwind classes for link cards
  const cardLinkStyle = "block p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-gray-50 transition duration-150 ease-in-out mb-4 text-center";
  const linkTextStyle = "text-lg font-medium text-blue-600";

  return (
    <div className="p-6 md:p-8"> {/* Add padding */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>

      {/* Role-Based Content */}
      {roles.includes('ROLE_ADMIN') && (
        <>
          <p className="text-gray-600 mb-8">Welcome, Administrator. Manage users, roles, and permissions from here.</p>
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Management Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/admin/users" className={cardLinkStyle}>
              <span className={linkTextStyle}>Manage Users</span>
              <p className="text-sm text-gray-500 mt-2">View, create, edit, and delete user accounts.</p>
            </Link>
            <Link to="/admin/roles" className={cardLinkStyle}>
              <span className={linkTextStyle}>Manage Roles</span>
              <p className="text-sm text-gray-500 mt-2">Define roles and assign permissions to them.</p>
            </Link>
            <Link to="/admin/permissions" className={cardLinkStyle}>
              <span className={linkTextStyle}>Manage Permissions</span>
              <p className="text-sm text-gray-500 mt-2">View and manage available application permissions.</p>
            </Link>
          </div>
        </>
      )}

      {roles.includes('ROLE_MODERATOR') && !roles.includes('ADMIN') && (
        <>
          <p className="text-gray-600 mb-8">Welcome, Moderator. You can manage users.</p>
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Management Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/admin/users" className={cardLinkStyle}>
              <span className={linkTextStyle}>Manage Users</span>
              <p className="text-sm text-gray-500 mt-2">View, create, edit, and delete user accounts.</p>
            </Link>
            {/* Add other Moderator-specific links here if needed */}
          </div>
        </>
      )}

      {!roles.includes('ROLE_ADMIN') && !roles.includes('ROLE_MODERATOR') && (
         <>
           <p className="text-gray-600 mb-8">Welcome to your dashboard.</p>
           <div className="bg-white p-6 rounded-lg shadow-md">
             <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Information</h2>
             <p className="text-gray-700 mb-2"><strong>Username:</strong> {username || 'N/A'}</p>
             <p className="text-gray-700"><strong>Roles:</strong> {roles.length > 0 ? roles.join(', ') : 'No roles assigned'}</p>
             {/* Add more user-specific info here if available/needed */}
           </div>
         </>
       )}

    </div>
  );
};

export default DashboardPage;