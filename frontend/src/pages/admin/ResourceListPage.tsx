import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui';
import { linkStyle } from '../../styles/commonStyles';
import { toast } from 'react-toastify';

// Interface for Resource data
interface Resource {
  id: string; // Assuming ID is string based on other pages
  name: string;
}

const ResourceListPage: React.FC = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchResources = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/resources');
      setResources(response.data || []);
    } catch (err) {
      console.error('Error fetching resources:', err);
      let errorMessage = 'Failed to fetch resources.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setResources([]);
      toast.error(`Error fetching resources: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (resourceId: string, resourceName: string) => {
    if (window.confirm(`Are you sure you want to delete resource "${resourceName}" (${resourceId})? This may affect existing permissions.`)) {
      setError(null);
      try {
        await apiClient.delete(`/resources/${resourceId}`);
        setResources(currentResources => currentResources.filter(res => res.id !== resourceId));
        toast.success(`Resource "${resourceName}" deleted successfully.`);
      } catch (err) {
        console.error(`Error deleting resource ${resourceId}:`, err);
        let errorMessage = 'Failed to delete resource. It might be in use by permissions.';
         if (err instanceof AxiosError) {
             errorMessage = err.response?.data?.message || err.response?.data?.error || errorMessage; // Prioritize backend message
         } else if (err instanceof Error) {
             errorMessage = err.message;
         }
        setError(errorMessage);
        toast.error(`Error deleting resource: ${errorMessage}`);
      }
    }
  };

  const handleEdit = (resourceId: string) => {
    navigate(`/admin/resources/edit/${resourceId}`);
  };

  return (
     <div className="container mx-auto px-4 py-6">
      {/* Header section */}
      <div className="flex flex-wrap justify-between items-center gap-y-2 mb-4">
        <h1 className="text-2xl font-bold">Resource Management</h1>
         <div className="flex items-center space-x-2">
            <Link to="/admin/resources/create">
                <Button variant="primary" size="sm">
                    + Create New Resource
                </Button>
            </Link>
             <Link to="/dashboard" className={linkStyle}>Back to Dashboard</Link>
        </div>
      </div>

      {loading && <p className="text-center">Loading resources...</p>}
      {error && <p className="text-red-600 text-center mb-4">Error: {error}</p>}

      {!loading && (
         <div className="shadow border rounded-lg overflow-x-auto">
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {resources.length > 0 ? (
                resources.map((resource) => (
                    <TableRow key={resource.id}>
                    <TableCell className="font-mono text-xs">{resource.id}</TableCell>
                    <TableCell>{resource.name}</TableCell>
                    <TableCell className="space-x-2 whitespace-nowrap">
                        {/* No 'View' page for simple resources */}
                        <Button onClick={() => handleEdit(resource.id)} variant="secondary" size="sm">
                            Edit
                        </Button>
                        <Button onClick={() => handleDelete(resource.id, resource.name)} variant="danger" size="sm">
                            Delete
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                    {!error ? 'No resources found.' : ''}
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

export default ResourceListPage;