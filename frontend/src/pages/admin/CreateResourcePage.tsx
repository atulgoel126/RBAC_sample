import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button, Input, Label, FormErrorMessage } from '../../components/ui';
import { linkStyle } from '../../styles/commonStyles';
import { toast } from 'react-toastify';

// Define the type for our form data
type CreateResourceFormData = {
  name: string;
};

const CreateResourcePage: React.FC = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateResourceFormData>();

  const onSubmit: SubmitHandler<CreateResourceFormData> = async (data) => {
    setApiError(null);
    const resourceName = data.name.trim();
    console.log('Attempting to create resource:', { name: resourceName });

    if (!resourceName) {
        setApiError("Resource name cannot be empty.");
        return;
    }

    try {
      // Backend expects a simple string for resource name
      await apiClient.post('/resources', resourceName, {
          headers: { 'Content-Type': 'text/plain' }
      });
      toast.success(`Resource "${resourceName}" created successfully!`);
      navigate('/admin/resources'); // Navigate to the list page
    } catch (err) {
      console.error('Error creating resource:', err);
      let errorMessage = 'Failed to create resource.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      if (errorMessage.toLowerCase().includes('already exists')) {
          setApiError(`Resource name "${resourceName}" already exists. Please choose a different name.`);
      } else {
          setApiError(errorMessage);
      }
      toast.error(`Error creating resource: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Resource</h1>
       <div className="mb-4">
         <Link to="/admin/resources" className={linkStyle}>&larr; Back to Resource List</Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow-md">
        <div className="space-y-1">
          <Label htmlFor="name">Resource Name:</Label>
          <Input
            type="text"
            id="name"
            error={!!errors.name} // Pass error prop
            placeholder="e.g., DOCUMENT, USER_PROFILE, ARTICLE"
            {...register("name", {
                required: "Resource name is required",
                pattern: {
                    // Allow letters, numbers, underscores, hyphens
                    value: /^[a-zA-Z0-9_-]+$/,
                    message: "Resource name can only contain letters, numbers, underscores, and hyphens."
                }
            })}
            disabled={isSubmitting}
          />
           <small className="text-xs text-gray-500 mt-1"> Use letters, numbers, underscores, hyphens (e.g., ORDER_DETAILS).</small>
           <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </div>

        {apiError && <p className="text-red-600 text-sm mt-2">{apiError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating...' : 'Create Resource'}
        </Button>
      </form>
    </div>
  );
};

export default CreateResourcePage;