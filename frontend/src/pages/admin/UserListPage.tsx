import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { linkStyle, thStyle, tdStyle, trStyle } from '../../styles/commonStyles'; // Import common styles

interface User {
  id: string;
  fullName: string;
  email: string;
  role: {
    name: string;
  };
}

// Removed local style constants

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUsers = async () => {
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
            {/* Use Button component inside Link */}
            <Link to="/admin/users/create">
                <Button variant="primary" size="sm"> {/* Adjust variant/size as needed */}
                    + Create New User
                </Button>
            </Link>
             {/* Use common linkStyle */}
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
                 {/* Use common thStyle */}
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
                     /* Use common trStyle */
                    <tr key={user.id} className={trStyle}>
                     {/* Use common tdStyle */}
                    <td className={`${tdStyle} font-mono text-xs`}>{user.id}</td>
                    <td className={tdStyle}>{user.fullName}</td>
                    <td className={tdStyle}>{user.email}</td>
                    <td className={tdStyle}>{user.role?.name || 'N/A'}</td>
                    <td className={`${tdStyle} space-x-2`}> {/* Add space between buttons */}
                         {/* Use common linkStyle */}
                        <Link
                            to={`/admin/users/view/${user.id}`}
                            className={`${linkStyle} mr-2`} // Use existing link style, add margin
                            title="View User Details"
                        >
                            View
                        </Link>
                        {/* Use Button component for Edit */}
                        <Button onClick={() => handleEdit(user.id)} variant="secondary" size="sm">
                            Edit
                        </Button>
                        {/* Use Button component for Delete */}
                        <Button onClick={() => handleDelete(user.id, user.fullName)} variant="danger" size="sm">
                            Delete
                        </Button>
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