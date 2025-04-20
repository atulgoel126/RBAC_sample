import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { linkStyle, thStyle, tdStyle, trStyle } from '../../styles/commonStyles'; // Import common styles

// Interface for Permission data
interface Permission {
  id: string;
  name: string;
  description?: string;
  resource?: { name: string };
  action?: { name: string };
}

// Removed local style constants

const PermissionListPage: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/permissions');
        setPermissions(response.data || []);
      } catch (err) {
        console.error('Error fetching permissions:', err);
        let errorMessage = 'Failed to fetch permissions.';
        if (err instanceof AxiosError) {
          errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setError(errorMessage);
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, []);

  const handleDelete = async (permissionId: string, permissionName: string) => {
     if (window.confirm(`Are you sure you want to delete permission "${permissionName}" (${permissionId})? This might affect role assignments.`)) {
         setError(null);
         try {
             await apiClient.delete(`/permissions/${permissionId}`);
             setPermissions(currentPermissions => currentPermissions.filter(p => p.id !== permissionId));
             // Consider toast notification
         } catch (err) {
             console.error(`Error deleting permission ${permissionId}:`, err);
             let errorMessage = 'Failed to delete permission.';
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
        <h1 className="text-2xl font-bold">Permission Management</h1>
        <div>
            {/* Use Button component inside Link */}
            <Link to="/admin/permissions/create">
                <Button variant="primary" size="sm">
                    + Create New Permission
                </Button>
            </Link>
             {/* Use common linkStyle */}
             <Link to="/dashboard" className={`${linkStyle} ml-4`}>Back to Dashboard</Link>
        </div>
      </div>

      {loading && <p className="text-center">Loading permissions...</p>}
      {error && <p className="text-red-600 text-center">Error: {error}</p>}

      {!loading && (
         <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
                <tr>
                 {/* Use common thStyle */}
                <th scope="col" className={thStyle}>ID</th>
                <th scope="col" className={thStyle}>Name (Resource:Action)</th>
                <th scope="col" className={thStyle}>Description</th>
                <th scope="col" className={thStyle}>Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {permissions.length > 0 ? (
                permissions.map((permission) => (
                     /* Use common trStyle */
                    <tr key={permission.id} className={trStyle}>
                     {/* Use common tdStyle */}
                    <td className={`${tdStyle} font-mono text-xs`}>{permission.id}</td>
                    <td className={tdStyle}>{permission.name || `${permission.resource?.name}:${permission.action?.name}`}</td>
                    <td className={tdStyle}>{permission.description || '-'}</td>
                    <td className={`${tdStyle} space-x-2`}>
                         {/* Use common linkStyle */}
                        <Link
                            to={`/admin/permissions/view/${permission.id}`}
                            className={`${linkStyle} mr-2`} // Use existing link style, add margin
                            title="View Permission Details"
                        >
                            View
                        </Link>
                         {/* Use common linkStyle */}
                        <Link
                            to={`/admin/permissions/edit/${permission.id}`}
                            className={linkStyle} // Use existing link style
                            title="Edit Permission Description"
                        >
                            Edit
                        </Link>
                        {/* Use Button component for Delete */}
                        <Button
                            onClick={() => handleDelete(permission.id, permission.name || `${permission.resource?.name}:${permission.action?.name}`)}
                            variant="danger"
                            size="sm"
                            title="Delete Permission" // Add title for clarity
                        >
                            Delete
                        </Button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                    {!error ? 'No permissions found.' : ''}
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

export default PermissionListPage;