import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui'; // Import Table components
import { linkStyle } from '../../styles/commonStyles'; // Keep needed common styles

// Interface for Role data
interface Role {
  id: string;
  name: string;
  description?: string;
}

// Removed local style constants

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
       {/* Header section with responsive flex wrap */}
      <div className="flex flex-wrap justify-between items-center gap-y-2 mb-4">
        <h1 className="text-2xl font-bold">Role Management</h1>
         <div className="flex items-center space-x-2"> {/* Wrap buttons/links */}
            <Link to="/admin/roles/create">
                <Button variant="primary" size="sm">
                    + Create New Role
                </Button>
            </Link>
             <Link to="/dashboard" className={linkStyle}>Back to Dashboard</Link> {/* Removed ml-4 */}
        </div>
      </div>

      {loading && <p className="text-center">Loading roles...</p>}
      {error && <p className="text-red-600 text-center">Error: {error}</p>}

      {!loading && (
         // Added overflow-x-auto for horizontal scrolling on small screens
         <div className="shadow border rounded-lg overflow-x-auto"> {/* Adjusted wrapper style */}
            <Table> {/* Use Table component */}
            <TableHeader> {/* Use TableHeader */}
                <TableRow> {/* Use TableRow */}
                <TableHead>ID</TableHead> {/* Use TableHead */}
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody> {/* Use TableBody */}
                {roles.length > 0 ? (
                roles.map((role) => (
                    <TableRow key={role.id}> {/* Use TableRow */}
                    <TableCell className="font-mono text-xs">{role.id}</TableCell> {/* Use TableCell */}
                    <TableCell>{role.name}</TableCell>
                    <TableCell>{role.description || '-'}</TableCell>
                     {/* Ensure actions don't wrap unnecessarily */}
                    <TableCell className="space-x-2 whitespace-nowrap">
                        <Link
                            to={`/admin/roles/view/${role.id}`}
                            className={`${linkStyle} mr-2`}
                            title="View Role Details"
                        >
                            View
                        </Link>
                        <Button onClick={() => handleEdit(role.id)} variant="secondary" size="sm">
                            Edit / Permissions
                        </Button>
                        <Button onClick={() => handleDelete(role.id, role.name)} variant="danger" size="sm">
                            Delete
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow> {/* Use TableRow */}
                    <TableCell colSpan={4} className="text-center text-gray-500"> {/* Use TableCell */}
                    {!error ? 'No roles found.' : ''}
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

export default RoleListPage;