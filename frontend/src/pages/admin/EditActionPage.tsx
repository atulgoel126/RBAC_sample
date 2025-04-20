import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../utils/apiClient';
import { Button, Input, Label, FormErrorMessage } from '../../components/ui';
import { linkStyle } from '../../styles/commonStyles';
import { AxiosError } from 'axios';

// Define interfaces
interface Action {
    id: string;
    name: string;
}

interface ActionEditFormData {
  name: string; // Only name is editable
}

const EditActionPage: React.FC = () => {
  const { actionId } = useParams<{ actionId: string }>();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ActionEditFormData>();
  const navigate = useNavigate();
  const [action, setAction] = useState<Action | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch action details on component mount
  useEffect(() => {
    const fetchAction = async () => {
      setIsLoadingData(true);
      setFormError(null);
      try {
        const response = await apiClient.get<Action>(`/actions/${actionId}`);
        setAction(response.data);
        // Set form value after data is fetched
        setValue('name', response.data.name || '');
      } catch (error: any) {
        console.error("Error fetching action:", error);
        setFormError("Failed to load action data. Please try again later or check the ID.");
        toast.error("Failed to load action data.");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (actionId) {
      fetchAction();
    } else {
      setFormError("Action ID is missing.");
      setIsLoadingData(false);
    }
  }, [actionId, setValue]);

  const onSubmit: SubmitHandler<ActionEditFormData> = async (data) => {
    setFormError(null);
    if (!actionId) {
        setFormError("Action ID is missing.");
        return;
    }
    const newName = data.name.trim();
    if (!newName) {
        setFormError("Action name cannot be empty.");
        return;
    }
     if (newName === action?.name) {
        toast.info("No changes detected in action name.");
        navigate('/admin/actions');
        return;
    }

    try {
      console.log("Updating action name:", actionId, newName);
      // Backend expects a simple string for action name update
      await apiClient.put(`/actions/${actionId}`, newName, {
          headers: { 'Content-Type': 'text/plain' }
      });
      toast.success('Action name updated successfully!');
      navigate('/admin/actions'); // Redirect after successful update
    } catch (error: any) {
      console.error('Error updating action:', error);
      let message = "Failed to update action name.";
       if (error instanceof AxiosError) {
           message = error.response?.data?.message || error.response?.data?.error || message;
       } else if (error instanceof Error) {
           message = error.message;
       }
      setFormError(message);
      toast.error(`Error: ${message}`);
    }
  };


  if (isLoadingData) {
    return <div className="text-center p-4">Loading action details...</div>;
  }

  if (!action) {
    return (
        <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Action</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{formError || "Action not found."}</span>
            </div>
            <Link to="/admin/actions" className={linkStyle}>&larr; Back to Action List</Link>
        </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Action</h1>
       <div className="mb-4">
         <Link to="/admin/actions" className={linkStyle}>&larr; Back to Action List</Link>
      </div>

      {formError && !isSubmitting && ( // Show form error only if not submitting
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded shadow-md">
        {/* Display ID as disabled field */}
        <div className="space-y-1">
          <Label htmlFor="actionIdDisplay">Action ID</Label>
          <Input
            type="text"
            id="actionIdDisplay"
            value={action.id}
            className="bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Editable Name */}
        <div className="space-y-1">
          <Label htmlFor="name">Action Name</Label>
          <Input
            type="text"
            id="name"
            {...register('name', {
                required: 'Action name is required',
                 pattern: {
                    value: /^[A-Z_]+$/,
                    message: "Action name must be uppercase letters and underscores only."
                }
           })}
           error={!!errors.name} // Pass error prop
           disabled={isSubmitting}
           placeholder="e.g., READ"
          />
           <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </div>

        <div className="flex justify-end space-x-3">
           <Button type="button" variant="outline" onClick={() => navigate('/admin/actions')} disabled={isSubmitting}>
             Cancel
           </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoadingData}
          >
            {isSubmitting ? 'Updating...' : 'Update Action'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditActionPage;