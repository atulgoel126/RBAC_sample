import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import apiClient from '../../utils/apiClient'; 
import { AxiosError } from 'axios';

interface User {
  id: string; 
  fullName: string;
  email: string;
  role: { 
    name: string; 
  };
}

// Common Tailwind styles (can be moved later)
const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline";
const buttonBase = "py-1 px-3 rounded text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50";
const primaryButton = `${buttonBase} bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500`;
const editButton = `${buttonBase} bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400 mr-2`; // Added margin right
const deleteButton = `${buttonBase} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
const thStyle = "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
const tdStyle = "px-4 py-2 whitespace-nowrap text-sm text-gray-700";
const trStyle = "border-b border-gray-200 hover:bg-gray-50";

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); 

  const fetchUsers = async () => {
    // ... fetch logic ...
     setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/users'); 
      setUsers(response.data || []); 
    } catch (err) {
      console.error('Error fetching users:', err);
      let errorMessage = 'Failed to fetch users.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setUsers([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); 

  const handleDelete = async (userId: string, userName: string) => {
    // ... delete logic ...
     if (userName === 'Admin User') { // Simplified check
         alert('Deleting the primary admin user is not allowed.');
         return;
    }
    if (window.confirm(`Are you sure you want to delete user "${userName}" (${userId})?`)) {
      setError(null); 
      try {
        await apiClient.delete(`/users/${userId}`);
        setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
        // Consider using a toast notification instead of alert
        // alert(`User "${userName}" deleted successfully.`); 
      } catch (err) {
        console.error(`Error deleting user ${userId}:`, err);
        let errorMessage = 'Failed to delete user.';
        if (err instanceof AxiosError) {
          errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage); 
      } 
    }
  };

  const handleEdit = (userId: string) => {
    navigate(`/admin/users/edit/${userId}`);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div>
            <Link to="/admin/users/create" className={primaryButton}>
            + Create New User
            </Link>
             <Link to="/dashboard" className={`${linkStyle} ml-4`}>Back to Dashboard</Link> 
        </div>
      </div>

      {loading && <p className="text-center">Loading users...</p>}
      {error && <p className="text-red-600 text-center">Error: {error}</p>}
      
      {!loading && ( 
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className={thStyle}>ID</th>
                <th scope="col" className={thStyle}>Full Name</th>
                <th scope="col" className={thStyle}>Email</th>
                <th scope="col" className={thStyle}>Role</th>
                <th scope="col" className={thStyle}>Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                users.map((user) => (
                    <tr key={user.id} className={trStyle}>
                    <td className={`${tdStyle} font-mono text-xs`}>{user.id}</td>
                    <td className={tdStyle}>{user.fullName}</td>
                    <td className={tdStyle}>{user.email}</td>
                    <td className={tdStyle}>{user.role?.name || 'N/A'}</td>
                    <td className={`${tdStyle} space-x-2`}> {/* Add space between buttons */}
                        <Link 
                            to={`/admin/users/view/${user.id}`} 
                            className={`${linkStyle} mr-2`} // Use existing link style, add margin
                            title="View User Details"
                        >
                            View
                        </Link>

                        <button onClick={() => handleEdit(user.id)} className={editButton}>
                        Edit
                        </button>
                        <button onClick={() => handleDelete(user.id, user.fullName)} className={deleteButton}>
                        Delete
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    {!error ? 'No users found.' : ''} 
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
      )}
    </div>
  );
};

export default UserListPage;