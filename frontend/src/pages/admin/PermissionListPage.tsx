import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../../utils/apiClient'; 
import { AxiosError } from 'axios';

// Interface for Permission data
interface Permission {
  id: string; 
  name: string; 
  description?: string; 
  resource?: { name: string };
  action?: { name: string };
}

// Common Tailwind styles
const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline";
const buttonBase = "py-1 px-3 rounded text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50";
const primaryButton = `${buttonBase} bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500`; // Style for Create Permission button
const deleteButton = `${buttonBase} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
const thStyle = "px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
const tdStyle = "px-4 py-2 whitespace-nowrap text-sm text-gray-700";
const trStyle = "border-b border-gray-200 hover:bg-gray-50";

const PermissionListPage: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPermissions = async () => {
      // ... fetch logic ...
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
    // ... delete logic ...
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
            <Link to="/admin/permissions/create" className={primaryButton}>
              + Create New Permission
            </Link>
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
                <th scope="col" className={thStyle}>ID</th>
                <th scope="col" className={thStyle}>Name (Resource:Action)</th>
                <th scope="col" className={thStyle}>Description</th>
                <th scope="col" className={thStyle}>Actions</th>
                </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
                {permissions.length > 0 ? (
                permissions.map((permission) => (
                    <tr key={permission.id} className={trStyle}>
                    <td className={`${tdStyle} font-mono text-xs`}>{permission.id}</td>
                    <td className={tdStyle}>{permission.name || `${permission.resource?.name}:${permission.action?.name}`}</td>
                    <td className={tdStyle}>{permission.description || '-'}</td>
                    <td className={`${tdStyle} space-x-2`}>
                        {/* Permissions often not editable via UI */}
                        <Link
                            to={`/admin/permissions/view/${permission.id}`}
                            className={`${linkStyle} mr-2`} // Use existing link style, add margin
                            title="View Permission Details"
                        >
                            View
                        </Link>

                        <Link 
                            to={`/admin/permissions/edit/${permission.id}`} 
                            className={linkStyle} // Use existing link style
                            title="Edit Permission Description"
                        >
                            Edit
                        </Link>

                        <button 
                            onClick={() => handleDelete(permission.id, permission.name || `${permission.resource?.name}:${permission.action?.name}`)} 
                            className={deleteButton}
                            title="Delete Permission" // Add title for clarity
                        >
                        Delete
                        </button>
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