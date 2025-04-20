import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { linkStyle, errorTextStyle, formInputStyle, formLabelStyle } from '../../styles/commonStyles'; // Import common styles

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
        <div>
          {/* Use Label component */}
          <Label htmlFor="fullName" className={formLabelStyle}>Full Name:</Label>
          {/* Use Input component */}
          <Input
            type="text"
            id="fullName"
            className={`${errors.fullName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            {...register("fullName", { required: "Full Name is required" })}
            disabled={isSubmitting}
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
            disabled={isSubmitting} // Consider if email should be editable
          />
           {/* Use common errorTextStyle */}
           {errors.email && <p className={errorTextStyle}>{errors.email.message}</p>}
        </div>
        {/* Password field omitted */}
        <div>
           {/* Use Label component */}
          <Label htmlFor="roleId" className={formLabelStyle}>Role:</Label>
           {/* Keep select, but apply common input style */}
          <select
            id="roleId"
            className={`${formInputStyle} pr-8 ${errors.roleId ? 'border-red-500 focus-visible:ring-red-500' : ''}`} // Apply common style + padding + error style
            {...register("roleId", { required: "Role is required" })}
            disabled={isSubmitting || loading || roles.length === 0} // Disable while loading roles too
          >
             <option value="" disabled>-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
           {/* Use common errorTextStyle */}
           {errors.roleId && <p className={errorTextStyle}>{errors.roleId.message}</p>}
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