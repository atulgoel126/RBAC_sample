import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../utils/apiClient';

// Define interfaces (can be shared or redefined if needed)
interface Resource {
  id: number;
  name: string;
}

interface Action {
  id: number;
  name: string;
}

interface Permission {
    id: number;
    resource: Resource;
    action: Action;
    description: string | null; // Allow null description
}

interface PermissionEditFormData {
  description: string; // Only description is editable
}

const EditPermissionPage: React.FC = () => {
  const { permissionId } = useParams<{ permissionId: string }>();
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<PermissionEditFormData>();
  const navigate = useNavigate();
  const [permission, setPermission] = useState<Permission | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch permission details on component mount
  useEffect(() => {
    const fetchPermission = async () => {
      setIsLoadingData(true);
      setFormError(null);
      try {
        const response = await apiClient.get<Permission>(`/permissions/${permissionId}`);
        setPermission(response.data);
        // Set form value after data is fetched
        setValue('description', response.data.description || ''); // Handle null description
      } catch (error: any) {
        console.error("Error fetching permission:", error);
        setFormError("Failed to load permission data. Please try again later or check the ID.");
        toast.error("Failed to load permission data.");
      } finally {
        setIsLoadingData(false);
      }
    };

    if (permissionId) {
      fetchPermission();
    } else {
      setFormError("Permission ID is missing.");
      setIsLoadingData(false);
    }
  }, [permissionId, setValue]);

  const onSubmit: SubmitHandler<PermissionEditFormData> = async (data) => {
    setFormError(null);
    if (!permissionId) {
        setFormError("Permission ID is missing.");
        return;
    }
    try {
      console.log("Updating permission description:", permissionId, data.description);
      // Send only the description in the request body as a plain string
      await apiClient.put(`/permissions/${permissionId}`, data.description, {
          headers: { 'Content-Type': 'text/plain' } // Adjust if backend expects JSON object
      });
      toast.success('Permission description updated successfully!');
      navigate('/admin/permissions'); // Redirect after successful update
    } catch (error: any) {
      console.error('Error updating permission:', error);
      const message = error.response?.data?.message || "Failed to update permission description.";
      setFormError(message);
      // Global interceptor might also show a toast
    }
  };

  // Tailwind classes (reuse or define as needed)
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
  const inputStyle = "block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
  const disabledInputStyle = `${inputStyle} bg-gray-100 cursor-not-allowed`;
  const errorTextStyle = "text-red-600 text-sm mt-1";
  const buttonStyle = `w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isSubmitting || isLoadingData ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (isLoadingData) {
    return <div className="text-center p-4">Loading permission details...</div>;
  }

  if (!permission) {
    return (
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Permission</h1>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{formError || "Permission not found."}</span>
            </div>
            <button onClick={() => navigate('/admin/permissions')} className="mt-4 text-indigo-600 hover:text-indigo-800">
                Back to Permissions List
            </button>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Permission</h1>

      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Display Resource and Action as disabled fields */}
        <div>
          <label htmlFor="resourceName" className={labelStyle}>Resource</label>
          <input
            type="text"
            id="resourceName"
            value={permission.resource.name}
            className={disabledInputStyle}
            disabled
          />
        </div>

        <div>
          <label htmlFor="actionName" className={labelStyle}>Action</label>
          <input
            type="text"
            id="actionName"
            value={permission.action.name}
            className={disabledInputStyle}
            disabled
          />
        </div>

        {/* Editable Description */}
        <div>
          <label htmlFor="description" className={labelStyle}>Description</label>
          <input
            type="text"
            id="description"
            {...register('description')} // No validation needed for optional field
            className={`${inputStyle} ${errors.description ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
            placeholder="Enter optional description"
          />
          {errors.description && <p className={errorTextStyle}>{errors.description.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            className={buttonStyle}
            disabled={isSubmitting || isLoadingData}
          >
            {isSubmitting ? 'Updating...' : 'Update Description'}
          </button>
        </div>
      </form>
       <button onClick={() => navigate('/admin/permissions')} className="mt-4 text-indigo-600 hover:text-indigo-800">
         Cancel
       </button>
    </div>
  );
};

export default EditPermissionPage;