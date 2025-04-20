import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card'; // Import the reusable Card

const DashboardPage: React.FC = () => {
  // Destructure userDetails from useAuth() and then get username, roles, fullName
  const { userDetails } = useAuth();
  const { username, roles, fullName } = userDetails;

  // Removed cardLinkStyle constant
  const linkTextStyle = "text-lg font-medium text-blue-600";
  const cardHoverStyle = "hover:shadow-lg hover:bg-gray-50"; // Keep hover style separate

  return (
    <div className="p-6 md:p-8"> {/* Add padding */}
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1>

      {/* Role-Based Content */}
      {roles.includes('ROLE_ADMIN') && (
        <>
          {/* Display full name if available */}
          <p className="text-gray-600 mb-8">Welcome, {fullName || username || 'Administrator'}. Manage users, roles, resources, actions, and permissions from here.</p>
          <h2 className="text-2xl font-semibold text-gray-700 mb-5">Management Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Use Card component for links */}
            <Link to="/admin/users">
              <Card className={`p-6 text-center ${cardHoverStyle}`}>
                <span className={linkTextStyle}>Manage Users</span>
                <p className="text-sm text-gray-500 mt-2">View, create, edit, and delete user accounts.</p>
              </Card>
            </Link>
            <Link to="/admin/roles">
              <Card className={`p-6 text-center ${cardHoverStyle}`}>
                <span className={linkTextStyle}>Manage Roles</span>
                <p className="text-sm text-gray-500 mt-2">Define roles and assign permissions to them.</p>
              </Card>
            </Link>
            <Link to="/admin/permissions">
              <Card className={`p-6 text-center ${cardHoverStyle}`}>
                <span className={linkTextStyle}>Manage Permissions</span>
                <p className="text-sm text-gray-500 mt-2">View and manage available application permissions.</p>
              </Card>
            </Link>
            <Link to="/admin/resources">
              <Card className={`p-6 text-center ${cardHoverStyle}`}>
                <span className={linkTextStyle}>Manage Resources</span>
                <p className="text-sm text-gray-500 mt-2">Define the resources that can be acted upon.</p>
              </Card>
            </Link>
            <Link to="/admin/actions">
              <Card className={`p-6 text-center ${cardHoverStyle}`}>
                <span className={linkTextStyle}>Manage Actions</span>
                <p className="text-sm text-gray-500 mt-2">Define the actions that can be performed on resources.</p>
              </Card>
            </Link>
          </div>
        </>
      )}

      {/* Refined Moderator View */}
      {roles.includes('ROLE_MODERATOR') && !roles.includes('ROLE_ADMIN') && (
        <>
          {/* Display full name if available */}
          <p className="text-gray-600 mb-6">Welcome, {fullName || username || 'Moderator'}. You have access to user management.</p>
          {/* Use Card component for link */}
          <Link to="/admin/users">
             <Card className={`p-6 text-center ${cardHoverStyle}`}>
                <span className={linkTextStyle}>Manage Users</span>
                <p className="text-sm text-gray-500 mt-2">View, create, edit, and delete user accounts.</p>
              </Card>
          </Link>
        </>
      )}

      {/* Default User View */}
      {!roles.includes('ROLE_ADMIN') && !roles.includes('ROLE_MODERATOR') && (
         <>
            {/* Display full name if available */}
            <p className="text-gray-600 mb-8">Welcome, {fullName || username || 'User'}.</p>
            {/* Use Card component for user info */}
            <Card className="p-6"> {/* Add padding directly */}
             <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Information</h2>
             <p className="text-gray-700 mb-2"><strong>Full Name:</strong> {fullName || '(Not Available)'}</p>
             <p className="text-gray-700 mb-2"><strong>Username/Email:</strong> {username || 'N/A'}</p>
             <p className="text-gray-700"><strong>Roles:</strong> {roles.length > 0 ? roles.join(', ') : 'No roles assigned'}</p>
             {/* Permissions are usually not displayed directly */}
           </Card>
         </>
       )}

    </div>
  );
};

export default DashboardPage;