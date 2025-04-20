import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../utils/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { errorTextStyle, formInputStyle, formLabelStyle, linkStyle } from '../../styles/commonStyles'; // Import common styles

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

// Removed local style constants

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
             {/* Use Button with link variant */}
            <Button onClick={() => navigate('/admin/permissions')} variant="link" className="mt-4">
                Back to Permissions List
            </Button>
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
           {/* Use Label component */}
          <Label htmlFor="resourceName" className={formLabelStyle}>Resource</Label>
           {/* Use Input component */}
          <Input
            type="text"
            id="resourceName"
            value={permission.resource.name}
            className={`${formInputStyle} bg-gray-100 cursor-not-allowed`} // Apply common style + disabled
            disabled
          />
        </div>

        <div>
           {/* Use Label component */}
          <Label htmlFor="actionName" className={formLabelStyle}>Action</Label>
           {/* Use Input component */}
          <Input
            type="text"
            id="actionName"
            value={permission.action.name}
            className={`${formInputStyle} bg-gray-100 cursor-not-allowed`} // Apply common style + disabled
            disabled
          />
        </div>

        {/* Editable Description */}
        <div>
           {/* Use Label component */}
          <Label htmlFor="description" className={formLabelStyle}>Description</Label>
           {/* Use Input component */}
          <Input
            type="text"
            id="description"
            {...register('description')} // No validation needed for optional field
            className={`${formInputStyle} ${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            disabled={isSubmitting}
            placeholder="Enter optional description"
          />
           {/* Use common errorTextStyle */}
          {errors.description && <p className={errorTextStyle}>{errors.description.message}</p>}
        </div>

        <div className="flex justify-end space-x-3"> {/* Align buttons */}
           {/* Use Button component for Cancel */}
           <Button type="button" variant="outline" onClick={() => navigate('/admin/permissions')} disabled={isSubmitting}>
             Cancel
           </Button>
           {/* Use Button component for Submit */}
          <Button
            type="submit"
            disabled={isSubmitting || isLoadingData}
          >
            {isSubmitting ? 'Updating...' : 'Update Description'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditPermissionPage;