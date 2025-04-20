import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui'; // Import Table components
import { linkStyle } from '../../styles/commonStyles'; // Keep needed common styles

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
      {/* Header section with responsive flex wrap */}
      <div className="flex flex-wrap justify-between items-center gap-y-2 mb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <div className="flex items-center space-x-2"> {/* Wrap buttons/links */}
            <Link to="/admin/users/create">
                <Button variant="primary" size="sm">
                    + Create New User
                </Button>
            </Link>
             <Link to="/dashboard" className={`${linkStyle}`}>Back to Dashboard</Link> {/* Removed ml-4, handled by space-x */}
        </div>
      </div>

      {loading && <p className="text-center">Loading users...</p>}
      {error && <p className="text-red-600 text-center">Error: {error}</p>}

      {!loading && (
        // Added overflow-x-auto for horizontal scrolling on small screens
        <div className="shadow border rounded-lg overflow-x-auto"> {/* Adjusted wrapper style */}
            <Table> {/* Use Table component */}
            <TableHeader> {/* Use TableHeader */}
                <TableRow> {/* Use TableRow */}
                <TableHead>ID</TableHead> {/* Use TableHead */}
                <TableHead>Full Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody> {/* Use TableBody */}
                {users.length > 0 ? (
                users.map((user) => (
                    <TableRow key={user.id}> {/* Use TableRow */}
                    <TableCell className="font-mono text-xs">{user.id}</TableCell> {/* Use TableCell */}
                    <TableCell>{user.fullName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role?.name || 'N/A'}</TableCell>
                    {/* Ensure actions don't wrap unnecessarily */}
                    <TableCell className="space-x-2 whitespace-nowrap">
                        <Link
                            to={`/admin/users/view/${user.id}`}
                            className={`${linkStyle} mr-2`}
                            title="View User Details"
                        >
                            View
                        </Link>
                        <Button onClick={() => handleEdit(user.id)} variant="secondary" size="sm">
                            Edit
                        </Button>
                        <Button onClick={() => handleDelete(user.id, user.fullName)} variant="danger" size="sm">
                            Delete
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow> {/* Use TableRow */}
                    <TableCell colSpan={5} className="text-center text-gray-500"> {/* Use TableCell */}
                    {!error ? 'No users found.' : ''}
                    </TableCell>
                </TableRow>
                )}
            </TableBody>
            </Table>
        </div>
      )}
    </div>
  );
};

export default UserListPage;