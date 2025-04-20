import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form'; 
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';

// Define the type for our form data
type CreateRoleFormData = {
  name: string;
  description: string;
};

// Common Tailwind styles
const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100";
const textareaStyle = inputStyle; // Use same base style for textarea
const buttonStyle = "inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50";
const errorTextStyle = "mt-1 text-xs text-red-600";
const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline";
const smallTextStyle = "text-xs text-gray-500 mt-1";

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
         <Link to="/admin/roles" className={linkStyle}>&larr; Back to Role List</Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow-md">
        <div>
          <label htmlFor="name" className={labelStyle}>Role Name:</label>
          <input
            type="text"
            id="name"
            className={inputStyle}
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
           {errors.name && <p className={errorTextStyle}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="description" className={labelStyle}>Description:</label>
          <textarea
            id="description"
            rows={3}
            className={textareaStyle}
            {...register("description")} 
            disabled={isSubmitting}
          />
           {errors.description && <p className={errorTextStyle}>{errors.description.message}</p>}
        </div>
       
        {apiError && <p className="text-red-600 text-sm mt-2">{apiError}</p>}

        <button type="submit" disabled={isSubmitting} className={`${buttonStyle} w-full`}>
          {isSubmitting ? 'Creating...' : 'Create Role'}
        </button>
      </form>
    </div>
  );
};

export default CreateRolePage;