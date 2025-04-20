import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { linkStyle, errorTextStyle, formLabelStyle } from '../../styles/commonStyles'; // Import common styles

// Define the type for our form data
type CreateRoleFormData = {
  name: string;
  description: string;
};

// Removed local style constants
const smallTextStyle = "text-xs text-gray-500 mt-1"; // Keep small text style for now

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
        <div>
          {/* Use Label component */}
          <Label htmlFor="name" className={formLabelStyle}>Role Name:</Label>
          {/* Use Input component */}
          <Input
            type="text"
            id="name"
            className={`${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
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
           <small className={smallTextStyle}> Use uppercase letters/underscores (e.g., CONTENT_EDITOR).</small>
           {/* Use common errorTextStyle */}
           {errors.name && <p className={errorTextStyle}>{errors.name.message}</p>}
        </div>
        <div>
           {/* Use Label component */}
          <Label htmlFor="description" className={formLabelStyle}>Description:</Label>
           {/* Use Input component for now (replace with Textarea later if created) */}
          <Input
            id="description"
            // Consider adding rows prop if Input component is enhanced or use Textarea
            className={`${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            {...register("description")}
            disabled={isSubmitting}
            placeholder="Optional: Describe the role's purpose"
          />
           {/* Use common errorTextStyle */}
           {errors.description && <p className={errorTextStyle}>{errors.description.message}</p>}
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