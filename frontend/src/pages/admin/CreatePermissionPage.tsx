import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../utils/apiClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { errorTextStyle, formInputStyle, formLabelStyle } from '../../styles/commonStyles'; // Import common styles

// Define interfaces for Resource and Action based on expected API response
interface Resource {
  id: number;
  name: string;
}

interface Action {
  id: number;
  name: string;
}

interface PermissionFormData {
  resourceId: number;
  actionId: number;
  description: string;
}

// Removed local style constants

const CreatePermissionPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<PermissionFormData>();
  const navigate = useNavigate();
  const [resources, setResources] = useState<Resource[]>([]);
  const [actions, setActions] = useState<Action[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  // Fetch resources and actions on component mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingData(true);
      setFormError(null);
      try {
        const [resourcesRes, actionsRes] = await Promise.all([
          apiClient.get('/resources'),
          apiClient.get('/actions')
        ]);
        setResources(resourcesRes.data || []);
        setActions(actionsRes.data || []);
      } catch (error: any) {
        console.error("Error fetching resources or actions:", error);
        setFormError("Failed to load necessary data. Please try again later.");
        // Toast error is handled by the global interceptor
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<PermissionFormData> = async (data) => {
    setFormError(null);
    try {
      // Convert IDs to numbers just in case they come from the form as strings
      const payload = {
        ...data,
        resourceId: Number(data.resourceId),
        actionId: Number(data.actionId),
      };
      console.log("Submitting permission:", payload);
      await apiClient.post('/permissions', payload);
      toast.success('Permission created successfully!');
      navigate('/admin/permissions'); // Redirect after successful creation
    } catch (error: any) {
      console.error('Error creating permission:', error);
      // Extract specific error message if available from response
      // The interceptor now handles more detailed messages, but keep local for form display
      const message = error.response?.data?.message || "Failed to create permission. The combination might already exist or input is invalid.";
      setFormError(message);
      // Global interceptor also shows a toast
    }
  };


  if (isLoadingData) {
    return <div className="text-center p-4">Loading resources and actions...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Permission</h1>

      {formError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{formError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          {/* Use Label component */}
          <Label htmlFor="resourceId" className={formLabelStyle}>Resource</Label>
           {/* Keep select, apply common style */}
          <select
            id="resourceId"
            {...register('resourceId', { required: 'Resource is required' })}
            className={`${formInputStyle} pr-8 ${errors.resourceId ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            disabled={isSubmitting || isLoadingData || resources.length === 0}
          >
            <option value="">-- Select Resource --</option>
            {resources.map(resource => (
              <option key={resource.id} value={resource.id}>{resource.name}</option>
            ))}
          </select>
           {/* Use common errorTextStyle */}
          {errors.resourceId && <p className={errorTextStyle}>{errors.resourceId.message}</p>}
           {resources.length === 0 && !isLoadingData && <p className={errorTextStyle}>No resources available. Please create resources first.</p>}
        </div>

        <div>
           {/* Use Label component */}
          <Label htmlFor="actionId" className={formLabelStyle}>Action</Label>
           {/* Keep select, apply common style */}
          <select
            id="actionId"
            {...register('actionId', { required: 'Action is required' })}
            className={`${formInputStyle} pr-8 ${errors.actionId ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            disabled={isSubmitting || isLoadingData || actions.length === 0}
          >
            <option value="">-- Select Action --</option>
            {actions.map(action => (
              <option key={action.id} value={action.id}>{action.name}</option>
            ))}
          </select>
           {/* Use common errorTextStyle */}
          {errors.actionId && <p className={errorTextStyle}>{errors.actionId.message}</p>}
           {actions.length === 0 && !isLoadingData && <p className={errorTextStyle}>No actions available. Please create actions first.</p>}
        </div>

        <div>
           {/* Use Label component */}
          <Label htmlFor="description" className={formLabelStyle}>Description (Optional)</Label>
           {/* Use Input component */}
          <Input
            type="text"
            id="description"
            {...register('description')}
            className={`${errors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
            disabled={isSubmitting || isLoadingData}
            placeholder="Optional: Describe what this permission allows"
          />
           {/* Use common errorTextStyle */}
          {errors.description && <p className={errorTextStyle}>{errors.description.message}</p>}
        </div>

        <div>
           {/* Use Button component */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isLoadingData || resources.length === 0 || actions.length === 0}
          >
            {isSubmitting ? 'Creating...' : 'Create Permission'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreatePermissionPage;