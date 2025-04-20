import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui';
import { linkStyle } from '../../styles/commonStyles';
import { toast } from 'react-toastify';

// Interface for Action data
interface Action {
  id: string; // Assuming ID is string
  name: string;
}

const ActionListPage: React.FC = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchActions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/actions');
      setActions(response.data || []);
    } catch (err) {
      console.error('Error fetching actions:', err);
      let errorMessage = 'Failed to fetch actions.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      setActions([]);
      toast.error(`Error fetching actions: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  const handleDelete = async (actionId: string, actionName: string) => {
    if (window.confirm(`Are you sure you want to delete action "${actionName}" (${actionId})? This may affect existing permissions.`)) {
      setError(null);
      try {
        await apiClient.delete(`/actions/${actionId}`);
        setActions(currentActions => currentActions.filter(act => act.id !== actionId));
        toast.success(`Action "${actionName}" deleted successfully.`);
      } catch (err) {
        console.error(`Error deleting action ${actionId}:`, err);
        let errorMessage = 'Failed to delete action. It might be in use by permissions.';
         if (err instanceof AxiosError) {
             errorMessage = err.response?.data?.message || err.response?.data?.error || errorMessage;
         } else if (err instanceof Error) {
             errorMessage = err.message;
         }
        setError(errorMessage);
        toast.error(`Error deleting action: ${errorMessage}`);
      }
    }
  };

  const handleEdit = (actionId: string) => {
    navigate(`/admin/actions/edit/${actionId}`);
  };

  return (
     <div className="container mx-auto px-4 py-6">
      {/* Header section */}
      <div className="flex flex-wrap justify-between items-center gap-y-2 mb-4">
        <h1 className="text-2xl font-bold">Action Management</h1>
         <div className="flex items-center space-x-2">
            <Link to="/admin/actions/create">
                <Button variant="primary" size="sm">
                    + Create New Action
                </Button>
            </Link>
             <Link to="/dashboard" className={linkStyle}>Back to Dashboard</Link>
        </div>
      </div>

      {loading && <p className="text-center">Loading actions...</p>}
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
                {actions.length > 0 ? (
                actions.map((action) => (
                    <TableRow key={action.id}>
                    <TableCell className="font-mono text-xs">{action.id}</TableCell>
                    <TableCell>{action.name}</TableCell>
                    <TableCell className="space-x-2 whitespace-nowrap">
                        {/* No 'View' page for simple actions */}
                        <Button onClick={() => handleEdit(action.id)} variant="secondary" size="sm">
                            Edit
                        </Button>
                        <Button onClick={() => handleDelete(action.id, action.name)} variant="danger" size="sm">
                            Delete
                        </Button>
                    </TableCell>
                    </TableRow>
                ))
                ) : (
                <TableRow>
                    <TableCell colSpan={3} className="text-center text-gray-500">
                    {!error ? 'No actions found.' : ''}
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

export default ActionListPage;