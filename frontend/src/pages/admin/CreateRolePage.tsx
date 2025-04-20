import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button, Input, Label, Textarea, FormErrorMessage } from '../../components/ui'; // Import FormErrorMessage
import { linkStyle } from '../../styles/commonStyles'; // Remove errorTextStyle import

// Define the type for our form data
type CreateRoleFormData = {
  name: string;
  description: string;
};

// Removed local style constants
// const smallTextStyle = "text-xs text-gray-500 mt-1"; // Remove unused style

const CreateRolePage: React.FC = () => {
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<CreateRoleFormData>();

  const onSubmit: SubmitHandler<CreateRoleFormData> = async (data) => {
    setApiError(null);
    const roleName = data.name.trim().toUpperCase();
    const roleDescription = data.description.trim();
    console.log('Attempting to create role:', { name: roleName, description: roleDescription });

    try {
      const payload = { name: roleName, description: roleDescription };
      await apiClient.post('/roles', payload);
      alert(`Role "${roleName}" created successfully!`);
      navigate('/admin/roles');
    } catch (err) {
      console.error('Error creating role:', err);
      let errorMessage = 'Failed to create role.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      if (errorMessage.toLowerCase().includes('already exists')) {
          setApiError(`Role name "${roleName}" already exists. Please choose a different name.`);
      } else {
          setApiError(errorMessage);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create New Role</h1>
       <div className="mb-4">
         {/* Use common linkStyle */}
         <Link to="/admin/roles" className={linkStyle}>&larr; Back to Role List</Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow-md">
        <div className="space-y-1"> {/* Add spacing */}
          {/* Use Label component (remove formLabelStyle) */}
          <Label htmlFor="name">Role Name:</Label>
          {/* Use Input component */}
          <Input
            type="text"
            id="name"
            error={!!errors.name} // Pass error prop
            placeholder="e.g., EDITOR"
            {...register("name", {
                required: "Role name is required",
                pattern: {
                    value: /^[a-zA-Z_]+$/,
                    message: "Role name can only contain letters and underscores."
                },
                // Custom validation to ensure uppercase (optional, backend should handle too)
                // validate: value => value === value.toUpperCase() || "Role name must be uppercase."
            })}
            disabled={isSubmitting}
          />
           <small className="text-xs text-gray-500 mt-1"> Use uppercase letters/underscores (e.g., CONTENT_EDITOR).</small> {/* Keep inline style for now */}
           <FormErrorMessage>{errors.name?.message}</FormErrorMessage> {/* Use component */}
        </div>
        <div className="space-y-1"> {/* Add spacing */}
           {/* Use Label component (remove formLabelStyle) */}
          <Label htmlFor="description">Description:</Label>
           {/* Use Textarea component */}
          <Textarea
            id="description"
            error={!!errors.description} // Pass error prop
            {...register("description")}
            disabled={isSubmitting}
            placeholder="Optional: Describe the role's purpose"
          />
           <FormErrorMessage>{errors.description?.message}</FormErrorMessage> {/* Use component */}
        </div>

        {apiError && <p className="text-red-600 text-sm mt-2">{apiError}</p>}

         {/* Use Button component */}
        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Creating...' : 'Create Role'}
        </Button>
      </form>
    </div>
  );
};

export default CreateRolePage;