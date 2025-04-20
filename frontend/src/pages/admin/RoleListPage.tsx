import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import apiClient from '../../utils/apiClient'; 
import { AxiosError } from 'axios';

// Interface for Role data
interface Role {
  id: string; 
  name: string; 
  description?: string; 
}

// Common Tailwind styles (copied for consistency)
const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline";
const buttonBase = "py-1 px-3 rounded text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50";
const primaryButton = `${buttonBase} bg-green-600 text-white hover:bg-green-700 focus:ring-green-500`; // Changed color for Create Role
const editButton = `${buttonBase} bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-400 mr-2`; 
const deleteButton = `${buttonBase} bg-red-600 text-white hover:bg-red-700 focus:ring-red-500`;
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
      // ... fetch logic ...
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
    // ... delete logic ...
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
            <Link to="/admin/roles/create" className={primaryButton}>
            + Create New Role
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
                        <button onClick={() => handleEdit(role.id)} className={editButton}>
                        Edit / Permissions
                        </button>
                        <button onClick={() => handleDelete(role.id, role.name)} className={deleteButton}>
                        Delete
                        </button>
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