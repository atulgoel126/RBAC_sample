import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button'; // Import the reusable Button

// Interface for Role data
interface Role {
  id: string;
  name: string;
  description?: string;
}

// Common Tailwind styles (copied for consistency)
const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline";
// Removed buttonBase, primaryButton, editButton, deleteButton constants
const thStyle = "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
const tdStyle = "px-4 py-2 whitespace-nowrap text-sm text-gray-700";
const trStyle = "border-b border-gray-200 hover:bg-gray-50";

const RoleListPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/roles');
        setRoles(response.data || []);
      } catch (err) {
        console.error('Error fetching roles:', err);
        let errorMessage = 'Failed to fetch roles.';
        if (err instanceof AxiosError) {
          errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleEdit = (roleId: string) => {
    navigate(`/admin/roles/edit/${roleId}`);
  };

  const handleDelete = async (roleId: string, roleName: string) => {
     if (['ADMIN', 'MODERATOR', 'USER'].includes(roleName)) {
         alert(`Deleting the core role "${roleName}" is generally not recommended.`);
         // return;
     }
     if (window.confirm(`Are you sure you want to delete role "${roleName}" (${roleId})?`)) {
         setError(null);
         try {
             await apiClient.delete(`/roles/${roleId}`);
             setRoles(currentRoles => currentRoles.filter(role => role.id !== roleId));
             // Consider toast notification
         } catch (err) {
             console.error(`Error deleting role ${roleId}:`, err);
             let errorMessage = 'Failed to delete role.';
             if (err instanceof AxiosError) {
                 errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
             } else if (err instanceof Error) {
                 errorMessage = err.message;
             }
             setError(errorMessage);
         }
     }
  };

  return (
     <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Role Management</h1>
        <div>
            {/* Use Button component inside Link */}
            <Link to="/admin/roles/create">
                <Button variant="primary" size="sm"> {/* Use standard primary */}
                    + Create New Role
                </Button>
            </Link>
             <Link to="/dashboard" className={`${linkStyle} ml-4`}>Back to Dashboard</Link>
        </div>
      </div>

      {loading && <p className="text-center">Loading roles...</p>}
      {error && <p className="text-red-600 text-center">Error: {error}</p>}

      {!loading && (
         <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                <th scope="col" className={thStyle}>ID</th>
                <th scope="col" className={thStyle}>Name</th>
                <th scope="col" className={thStyle}>Description</th>
                <th scope="col" className={thStyle}>Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {roles.length > 0 ? (
                roles.map((role) => (
                    <tr key={role.id} className={trStyle}>
                    <td className={`${tdStyle} font-mono text-xs`}>{role.id}</td>
                    <td className={tdStyle}>{role.name}</td>
                    <td className={tdStyle}>{role.description || '-'}</td>
                    <td className={`${tdStyle} space-x-2`}>
                        <Link
                            to={`/admin/roles/view/${role.id}`}
                            className={`${linkStyle} mr-2`} // Use existing link style, add margin
                            title="View Role Details"
                        >
                            View
                        </Link>
                        {/* Use Button component for Edit */}
                        <Button onClick={() => handleEdit(role.id)} variant="secondary" size="sm">
                            Edit / Permissions
                        </Button>
                        {/* Use Button component for Delete */}
                        <Button onClick={() => handleDelete(role.id, role.name)} variant="danger" size="sm">
                            Delete
                        </Button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    {!error ? 'No roles found.' : ''}
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

export default RoleListPage;