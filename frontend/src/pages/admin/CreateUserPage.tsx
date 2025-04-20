import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form'; 
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';

// Interface for Role data
interface Role {
  id: string; 
  name: string; 
}

// Define the type for our form data
type CreateUserFormData = {
  fullName: string;
  email: string;
  password: string;
  roleId: string; 
};

// Common Tailwind styles (copied for consistency)
const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100";
const selectStyle = `${inputStyle} pr-8`; // Add padding for dropdown arrow
const buttonStyle = "inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50";
const errorTextStyle = "mt-1 text-xs text-red-600";
const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline";

const CreateUserPage: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]); 
  const [apiError, setApiError] = useState<string | null>(null);
  const [rolesLoading, setRolesLoading] = useState(true); 
  const [rolesError, setRolesError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    setValue, 
    formState: { errors, isSubmitting } 
  } = useForm<CreateUserFormData>();

  useEffect(() => {
    const fetchRoles = async () => {
      setRolesLoading(true);
      setRolesError(null);
      try {
        const response = await apiClient.get('/roles'); 
        const fetchedRoles = response.data || [];
        setRoles(fetchedRoles);
        if (fetchedRoles.length > 0) {
           const userRole = fetchedRoles.find((r: Role) => r.name === 'USER');
           const defaultRoleId = userRole ? userRole.id : fetchedRoles[0].id;
           setValue('roleId', defaultRoleId); 
        }
      } catch (err) {
        console.error('Error fetching roles:', err);
        setRolesError('Failed to load roles. Cannot create user.');
        setRoles([]);
      } finally {
        setRolesLoading(false);
      }
    };
    fetchRoles();
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [setValue]); 

  const onSubmit: SubmitHandler<CreateUserFormData> = async (data) => {
    setApiError(null);
    console.log('Attempting to create user:', data);
    try {
      await apiClient.post('/users', data); 
      alert('User created successfully!'); 
      navigate('/admin/users'); 
    } catch (err) {
      console.error('Error creating user:', err);
      let errorMessage = 'Failed to create user.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setApiError(errorMessage);
    }
  };

  return (
    <div className="max-w-lg mx-auto"> {/* Center content */}
      <h1 className="text-2xl font-bold mb-4">Create New User</h1>
      <div className="mb-4">
         <Link to="/admin/users" className={linkStyle}>&larr; Back to User List</Link>
      </div>

      {rolesError && <p className="text-red-600 mb-4">Error loading roles: {rolesError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow-md">
        <div>
          <label htmlFor="fullName" className={labelStyle}>Full Name:</label>
          <input
            type="text"
            id="fullName"
            className={inputStyle}
            {...register("fullName", { required: "Full Name is required" })}
            disabled={isSubmitting || rolesLoading}
          />
          {errors.fullName && <p className={errorTextStyle}>{errors.fullName.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className={labelStyle}>Email:</label>
          <input
            type="email"
            id="email"
            className={inputStyle}
             {...register("email", { 
              required: "Email is required", 
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              } 
            })}
            disabled={isSubmitting || rolesLoading}
          />
           {errors.email && <p className={errorTextStyle}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className={labelStyle}>Password:</label>
          <input
            type="password"
            id="password"
            className={inputStyle}
            {...register("password", { 
              required: "Password is required", 
              minLength: { value: 6, message: "Password must be at least 6 characters" } 
            })}
            disabled={isSubmitting || rolesLoading}
          />
           {errors.password && <p className={errorTextStyle}>{errors.password.message}</p>}
        </div>
        <div>
          <label htmlFor="roleId" className={labelStyle}>Role:</label>
          <select
            id="roleId"
            className={selectStyle} // Apply select style
            {...register("roleId", { required: "Role is required" })}
            disabled={isSubmitting || rolesLoading || rolesError !== null}
          >
             <option value="" disabled={!rolesLoading && roles.length > 0}> 
               {rolesLoading ? 'Loading roles...' : (roles.length === 0 ? 'No roles available' : '-- Select Role --')}
             </option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name} 
              </option>
            ))}
          </select>
           {errors.roleId && <p className={errorTextStyle}>{errors.roleId.message}</p>}
        </div>

        {apiError && <p className="text-red-600 text-sm mt-2">{apiError}</p>}

        <button type="submit" disabled={isSubmitting || rolesLoading || rolesError !== null} className={`${buttonStyle} w-full`}>
          {isSubmitting ? 'Creating...' : 'Create User'}
        </button>
      </form>
    </div>
  );
};

export default CreateUserPage;