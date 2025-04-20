import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../utils/apiClient';
import { Button, Input, Label, FormErrorMessage } from '../../components/ui';
import { linkStyle } from '../../styles/commonStyles';
import { AxiosError } from 'axios';

// Define interfaces
interface Resource {
    id: string;
    name: string;
}

interface ResourceEditFormData {
  name: string; // Only name is editable
}

const EditResourcePage: React.FC = () => {
  const { resourceId } = useParams<{ resourceId: string }>();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<ResourceEditFormData>();
  const navigate = useNavigate();
  const [resource, setResource] = useState<Resource | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch resource details on component mount
  useEffect(() => {
    const fetchResource = async () => {
      setIsLoadingData(true);
      setFormError(null);
      try {
        const response = await apiClient.get<Resource>(`/resources/${resourceId}`);
        setResource(response.data);
        // Set form value after data is fetched
        setValue('name', response.data.name || '');
      } catch (error: any) {
        console.error("Error fetching resource:", error);
        setFormError("Failed to load resource data. Please try again later or check the ID.");
        toast.error("Failed to load resource data.");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (resourceId) {
      fetchResource();
    } else {
      setFormError("Resource ID is missing.");
      setIsLoadingData(false);
    }
  }, [resourceId, setValue]);

  const onSubmit: SubmitHandler<ResourceEditFormData> = async (data) => {
    setFormError(null);
    if (!resourceId) {
        setFormError("Resource ID is missing.");
        return;
    }
    const newName = data.name.trim();
    if (!newName) {
        setFormError("Resource name cannot be empty.");
        return;
    }
    if (newName === resource?.name) {
        toast.info("No changes detected in resource name.");
        navigate('/admin/resources');
        return;
    }

    try {
      console.log("Updating resource name:", resourceId, newName);
      // Backend expects a simple string for resource name update
      await apiClient.put(`/resources/${resourceId}`, newName, {
          headers: { 'Content-Type': 'text/plain' }
      });
      toast.success('Resource name updated successfully!');
      navigate('/admin/resources'); // Redirect after successful update
    } catch (error: any) {
      console.error('Error updating resource:', error);
      let message = "Failed to update resource name.";
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
    return <div className="text-center p-4">Loading resource details...</div>;
  }

  if (!resource) {
    return (
        <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Resource</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{formError || "Resource not found."}</span>
            </div>
            <Link to="/admin/resources" className={linkStyle}>&larr; Back to Resource List</Link>
        </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Resource</h1>
       <div className="mb-4">
         <Link to="/admin/resources" className={linkStyle}>&larr; Back to Resource List</Link>
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
          <Label htmlFor="resourceIdDisplay">Resource ID</Label>
          <Input
            type="text"
            id="resourceIdDisplay"
            value={resource.id}
            className="bg-gray-100 cursor-not-allowed"
            disabled
          />
        </div>

        {/* Editable Name */}
        <div className="space-y-1">
          <Label htmlFor="name">Resource Name</Label>
          <Input
            type="text"
            id="name"
            {...register('name', {
                required: 'Resource name is required',
                 pattern: {
                    value: /^[a-zA-Z0-9_-]+$/,
                    message: "Resource name can only contain letters, numbers, underscores, and hyphens."
                }
           })}
           error={!!errors.name} // Pass error prop
           disabled={isSubmitting}
           placeholder="e.g., DOCUMENT"
          />
           <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </div>

        <div className="flex justify-end space-x-3">
           <Button type="button" variant="outline" onClick={() => navigate('/admin/resources')} disabled={isSubmitting}>
             Cancel
           </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoadingData}
          >
            {isSubmitting ? 'Updating...' : 'Update Resource'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditResourcePage;