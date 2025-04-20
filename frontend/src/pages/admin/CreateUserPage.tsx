import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { linkStyle, errorTextStyle, formInputStyle, formLabelStyle } from '../../styles/commonStyles'; // Import common styles

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
        <div>
          {/* Use Label component */}
          <Label htmlFor="fullName" className={formLabelStyle}>Full Name:</Label>
          {/* Use Input component */}
          <Input
            type="text"
            id="fullName"
            className={`${errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            {...register("fullName", { required: "Full Name is required" })}
            disabled={isSubmitting || rolesLoading}
          />
           {/* Use common errorTextStyle */}
          {errors.fullName && <p className={errorTextStyle}>{errors.fullName.message}</p>}
        </div>
        <div>
           {/* Use Label component */}
          <Label htmlFor="email" className={formLabelStyle}>Email:</Label>
           {/* Use Input component */}
          <Input
            type="email"
            id="email"
            className={`${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
             {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            disabled={isSubmitting || rolesLoading}
          />
           {/* Use common errorTextStyle */}
           {errors.email && <p className={errorTextStyle}>{errors.email.message}</p>}
        </div>
        <div>
           {/* Use Label component */}
          <Label htmlFor="password" className={formLabelStyle}>Password:</Label>
           {/* Use Input component */}
          <Input
            type="password"
            id="password"
            className={`${errors.password ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
            disabled={isSubmitting || rolesLoading}
          />
           {/* Use common errorTextStyle */}
           {errors.password && <p className={errorTextStyle}>{errors.password.message}</p>}
        </div>
        <div>
           {/* Use Label component */}
          <Label htmlFor="roleId" className={formLabelStyle}>Role:</Label>
           {/* Keep select, but apply common input style */}
          <select
            id="roleId"
            className={`${formInputStyle} pr-8 ${errors.roleId ? 'border-red-500 focus-visible:ring-red-500' : ''}`} // Apply common style + padding + error style
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
           {/* Use common errorTextStyle */}
           {errors.roleId && <p className={errorTextStyle}>{errors.roleId.message}</p>}
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