import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
import { toast } from 'react-toastify';

// Interface matching the UserResponseDto from backend
interface UserDetails {
  id: number;
  email: string;
  fullName: string;
  roleName: string;
  roleId: number;
  createdAt: string; // Assuming ISO string format from backend
  updatedAt: string; // Assuming ISO string format from backend
}

const ViewUserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<UserDetails>(`/users/${userId}`);
        setUser(response.data);
      } catch (err: any) {
        console.error("Error fetching user details:", err);
        const message = err.response?.data?.message || "Failed to load user details.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    } else {
      setError("User ID is missing from URL.");
      setLoading(false);
    }
  }, [userId]);

  // Helper to format date/time strings
  const formatDateTime = (dateTimeString: string | undefined) => {
    if (!dateTimeString) return 'N/A';
    try {
      return new Date(dateTimeString).toLocaleString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Tailwind classes
  const cardStyle = "bg-white shadow overflow-hidden sm:rounded-lg";
  const headerStyle = "px-4 py-5 sm:px-6 border-b border-gray-200";
  const titleStyle = "text-lg leading-6 font-medium text-gray-900";
  const contentStyle = "px-4 py-5 sm:p-0";
  const dlStyle = "sm:divide-y sm:divide-gray-200";
  const dtStyle = "text-sm font-medium text-gray-500";
  const ddStyle = "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2";
  const rowStyle = "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6";
  const buttonStyle = "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline";


  if (loading) {
    return <div className="text-center p-6">Loading user details...</div>;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button onClick={() => navigate('/admin/users')} className={buttonStyle}>
          Back to User List
        </button>
      </div>
    );
  }

  if (!user) {
     return <div className="text-center p-6">User not found.</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
       <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">User Details</h1>
            <button onClick={() => navigate('/admin/users')} className={buttonStyle}>
                Back to User List
            </button>
       </div>


      <div className={cardStyle}>
        <div className={headerStyle}>
          <h3 className={titleStyle}>User Information</h3>
        </div>
        <div className={contentStyle}>
          <dl className={dlStyle}>
            <div className={rowStyle}>
              <dt className={dtStyle}>User ID</dt>
              <dd className={`${ddStyle} font-mono text-xs`}>{user.id}</dd>
            </div>
            <div className={rowStyle}>
              <dt className={dtStyle}>Full Name</dt>
              <dd className={ddStyle}>{user.fullName}</dd>
            </div>
            <div className={rowStyle}>
              <dt className={dtStyle}>Email Address</dt>
              <dd className={ddStyle}>{user.email}</dd>
            </div>
            <div className={rowStyle}>
              <dt className={dtStyle}>Role</dt>
              <dd className={ddStyle}>
                {user.roleName} (ID: {user.roleId})
                {/* Optional: Link to view role details if that page exists */}
                {/* <Link to={`/admin/roles/view/${user.roleId}`} className={`${linkStyle} ml-2`}>(View Role)</Link> */}
              </dd>
            </div>
            <div className={rowStyle}>
              <dt className={dtStyle}>Created At</dt>
              <dd className={ddStyle}>{formatDateTime(user.createdAt)}</dd>
            </div>
            <div className={rowStyle}>
              <dt className={dtStyle}>Last Updated At</dt>
              <dd className={ddStyle}>{formatDateTime(user.updatedAt)}</dd>
            </div>
             <div className={`${rowStyle} border-t border-gray-200`}>
                <dt className={dtStyle}>Actions</dt>
                <dd className={`${ddStyle} space-x-3`}>
                     <Link to={`/admin/users/edit/${user.id}`} className={linkStyle}>Edit User</Link>
                     {/* Add delete button here if needed, similar to list page */}
                </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ViewUserPage;