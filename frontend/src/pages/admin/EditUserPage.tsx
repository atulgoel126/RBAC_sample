import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form'; 
import apiClient from '../../utils/apiClient';
import { AxiosError } from 'axios';

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

// Common Tailwind styles
const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100";
const selectStyle = `${inputStyle} pr-8`; 
const buttonStyle = "inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50";
const errorTextStyle = "mt-1 text-xs text-red-600";
const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline";

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

  if (apiError && !isSubmitting) { 
     return <p className="text-red-600 text-center mt-8">Error loading data: {apiError}</p>;
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit User (ID: {userId})</h1>
       <div className="mb-4">
         <Link to="/admin/users" className={linkStyle}>&larr; Back to User List</Link>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded shadow-md">
        <div>
          <label htmlFor="fullName" className={labelStyle}>Full Name:</label>
          <input
            type="text"
            id="fullName"
            className={inputStyle}
            {...register("fullName", { required: "Full Name is required" })}
            disabled={isSubmitting}
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
            disabled={isSubmitting} // Consider if email should be editable
          />
           {errors.email && <p className={errorTextStyle}>{errors.email.message}</p>}
        </div>
        {/* Password field omitted */}
        <div>
          <label htmlFor="roleId" className={labelStyle}>Role:</label>
          <select
            id="roleId"
            className={selectStyle}
            {...register("roleId", { required: "Role is required" })}
            disabled={isSubmitting || roles.length === 0 || loading} // Disable while loading roles too
          >
             <option value="" disabled>-- Select Role --</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name} 
              </option>
            ))}
          </select>
           {errors.roleId && <p className={errorTextStyle}>{errors.roleId.message}</p>}
        </div>

        {apiError && <p className="text-red-600 text-sm mt-2">{apiError}</p>} 

        <button type="submit" disabled={isSubmitting || loading} className={`${buttonStyle} w-full`}>
          {isSubmitting ? 'Updating...' : 'Update User'}
        </button>
      </form>
    </div>
  );
};

export default EditUserPage;