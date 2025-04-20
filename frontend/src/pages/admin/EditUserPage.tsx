import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button, Input, Label, Select, FormErrorMessage } from '../../components/ui'; // Import FormErrorMessage
import { linkStyle } from '../../styles/commonStyles'; // Remove errorTextStyle import

// Interfaces
interface Role {
  id: string;
  name: string;
}

// Form data type
type EditUserFormData = {
  fullName: string;
  email: string;
  roleId: string;
};

// Removed local style constants

const EditUserPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<EditUserFormData>();

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setApiError("User ID not found in URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setApiError(null);
      try {
        const [rolesResponse, userResponse] = await Promise.all([
            apiClient.get('/roles'),
            apiClient.get(`/users/${userId}`)
        ]);

        setRoles(rolesResponse.data || []);
        const fetchedUser = userResponse.data;

        if (fetchedUser) {
          reset({
            fullName: fetchedUser.fullName || '',
            email: fetchedUser.email || '',
            roleId: fetchedUser.role?.id || '',
          });
        } else {
          throw new Error("User data not found.");
        }
      } catch (err) {
        console.error('Error fetching data for edit:', err);
        let errorMessage = 'Failed to load user data or roles.';
        if (err instanceof AxiosError) {
          errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }
        setApiError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, reset]);

  const onSubmit: SubmitHandler<EditUserFormData> = async (data) => {
    setApiError(null);
    if (!userId) { setApiError("User ID is missing."); return; }
    if (!data.roleId) { setApiError("Please select a role."); return; }

    console.log('Attempting to update user:', userId, data);
    try {
      const payload = {
        fullName: data.fullName,
        email: data.email,
        roleId: data.roleId,
      };
      await apiClient.put(`/users/${userId}`, payload);
      // Use toast notification?
      alert('User updated successfully!');
      navigate('/admin/users');
    } catch (err) {
      console.error(`Error updating user ${userId}:`, err);
      let errorMessage = 'Failed to update user.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setApiError(errorMessage);
    }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading user data...</p>;
  }

  // Show error prominently if loading failed
  if (apiError && !isSubmitting && roles.length === 0) { // Check if roles also failed to load
     return (
        <div className="max-w-lg mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Edit User (ID: {userId})</h1>
             <div className="mb-4">
                <Link to="/admin/users" className={linkStyle}>&larr; Back to User List</Link>
            </div>
            <p className="text-red-600 text-center mt-8">Error loading data: {apiError}</p>
        </div>
     );
  }


  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit User (ID: {userId})</h1>
       <div className="mb-4">
         {/* Use common linkStyle */}
         <Link to="/admin/users" className={linkStyle}>&larr; Back to User List</Link>
      </div>

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
            disabled={isSubmitting}
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
            disabled={isSubmitting} // Consider if email should be editable
          />
           <FormErrorMessage>{errors.email?.message}</FormErrorMessage> {/* Use component */}
        </div>
        {/* Password field omitted */}
        <div className="space-y-1"> {/* Add spacing */}
           {/* Use Label component (remove formLabelStyle) */}
          <Label htmlFor="roleId">Role:</Label>
           {/* Use Select component */}
          <Select
            id="roleId"
            error={!!errors.roleId} // Pass error prop
            {...register("roleId", { required: "Role is required" })}
            disabled={isSubmitting || loading || roles.length === 0} // Disable while loading roles too
            options={roles.map(r => ({ value: r.id, label: r.name }))}
            placeholder="-- Select Role --"
          />
           <FormErrorMessage>{errors.roleId?.message}</FormErrorMessage> {/* Use component */}
        </div>

        {/* Display API error related to submission */}
        {apiError && isSubmitting && <p className="text-red-600 text-sm mt-2">{apiError}</p>}

         {/* Use Button component */}
        <Button type="submit" disabled={isSubmitting || loading} className="w-full">
          {isSubmitting ? 'Updating...' : 'Update User'}
        </Button>
      </form>
    </div>
  );
};

export default EditUserPage;