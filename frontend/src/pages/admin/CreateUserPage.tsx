import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button, Input, Label, Select, FormErrorMessage } from '../../components/ui'; // Import FormErrorMessage
import { linkStyle } from '../../styles/commonStyles'; // Remove errorTextStyle import

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

// Removed local style constants

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
      // Use toast notification instead of alert for consistency? (Low priority)
      // toast.success('User created successfully!');
      alert('User created successfully!');
      navigate('/admin/users');
    } catch (err) {
      console.error('Error creating user:', err);
      let errorMessage = 'Failed to create user.';
      if (err instanceof AxiosError) {
        // Use the improved error handling from apiClient interceptor
        // The interceptor already shows a toast
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setApiError(errorMessage); // Keep setting local error for display below form if needed
    }
  };

  return (
    <div className="max-w-lg mx-auto"> {/* Center content */}
      <h1 className="text-2xl font-bold mb-4">Create New User</h1>
      <div className="mb-4">
         {/* Use common linkStyle */}
         <Link to="/admin/users" className={linkStyle}>&larr; Back to User List</Link>
      </div>

      {rolesError && <p className="text-red-600 mb-4">Error loading roles: {rolesError}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow-md">
        <div className="space-y-1"> {/* Add spacing */}
          {/* Use Label component (remove formLabelStyle) */}
          <Label htmlFor="fullName">Full Name:</Label>
          {/* Use Input component */}
          <Input
            type="text"
            id="fullName"
            error={!!errors.fullName} // Pass error prop
            {...register("fullName", { required: "Full Name is required" })}
            disabled={isSubmitting || rolesLoading}
          />
           <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage> {/* Use component */}
        </div>
        <div className="space-y-1"> {/* Add spacing */}
           {/* Use Label component (remove formLabelStyle) */}
          <Label htmlFor="email">Email:</Label>
           {/* Use Input component */}
          <Input
            type="email"
            id="email"
            error={!!errors.email} // Pass error prop
             {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            disabled={isSubmitting || rolesLoading}
          />
           <FormErrorMessage>{errors.email?.message}</FormErrorMessage> {/* Use component */}
        </div>
        <div className="space-y-1"> {/* Add spacing */}
           {/* Use Label component (remove formLabelStyle) */}
          <Label htmlFor="password">Password:</Label>
           {/* Use Input component */}
          <Input
            type="password"
            id="password"
            error={!!errors.password} // Pass error prop
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
            disabled={isSubmitting || rolesLoading}
          />
           <FormErrorMessage>{errors.password?.message}</FormErrorMessage> {/* Use component */}
        </div>
        <div className="space-y-1"> {/* Add spacing */}
           {/* Use Label component (remove formLabelStyle) */}
          <Label htmlFor="roleId">Role:</Label>
           {/* Use Select component */}
          <Select
            id="roleId"
            error={!!errors.roleId} // Pass error prop
            {...register("roleId", { required: "Role is required" })}
            disabled={isSubmitting || rolesLoading || rolesError !== null}
            options={roles.map(r => ({ value: r.id, label: r.name }))}
            placeholder={rolesLoading ? 'Loading roles...' : (roles.length === 0 ? 'No roles available' : '-- Select Role --')}
          />
           <FormErrorMessage>{errors.roleId?.message}</FormErrorMessage> {/* Use component */}
        </div>

        {apiError && <p className="text-red-600 text-sm mt-2">{apiError}</p>}

         {/* Use Button component */}
        <Button type="submit" disabled={isSubmitting || rolesLoading || rolesError !== null} className="w-full">
          {isSubmitting ? 'Creating...' : 'Create User'}
        </Button>
      </form>
    </div>
  );
};

export default CreateUserPage;