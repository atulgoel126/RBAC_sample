import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button, Input, Label, FormErrorMessage } from '../../components/ui';
import { linkStyle } from '../../styles/commonStyles';
import { toast } from 'react-toastify';

// Define the type for our form data
type CreateActionFormData = {
  name: string;
};

const CreateActionPage: React.FC = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateActionFormData>();

  const onSubmit: SubmitHandler<CreateActionFormData> = async (data) => {
    setApiError(null);
    const actionName = data.name.trim();
    console.log('Attempting to create action:', { name: actionName });

    if (!actionName) {
        setApiError("Action name cannot be empty.");
        return;
    }

    try {
      // Backend expects a simple string for action name
      await apiClient.post('/actions', actionName, {
          headers: { 'Content-Type': 'text/plain' }
      });
      toast.success(`Action "${actionName}" created successfully!`);
      navigate('/admin/actions'); // Navigate to the list page
    } catch (err) {
      console.error('Error creating action:', err);
      let errorMessage = 'Failed to create action.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      if (errorMessage.toLowerCase().includes('already exists')) {
          setApiError(`Action name "${actionName}" already exists. Please choose a different name.`);
      } else {
          setApiError(errorMessage);
      }
      toast.error(`Error creating action: ${errorMessage}`);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Action</h1>
       <div className="mb-4">
         <Link to="/admin/actions" className={linkStyle}>&larr; Back to Action List</Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow-md">
        <div className="space-y-1">
          <Label htmlFor="name">Action Name:</Label>
          <Input
            type="text"
            id="name"
            error={!!errors.name} // Pass error prop
            placeholder="e.g., READ, WRITE, DELETE, APPROVE"
            {...register("name", {
                required: "Action name is required",
                pattern: {
                    // Allow uppercase letters and underscores
                    value: /^[A-Z_]+$/,
                    message: "Action name must be uppercase letters and underscores only."
                }
            })}
            disabled={isSubmitting}
          />
           <small className="text-xs text-gray-500 mt-1"> Use uppercase letters and underscores (e.g., READ_CONTENT).</small>
           <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
        </div>

        {apiError && <p className="text-red-600 text-sm mt-2">{apiError}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating...' : 'Create Action'}
        </Button>
      </form>
    </div>
  );
};

export default CreateActionPage;