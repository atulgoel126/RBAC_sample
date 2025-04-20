import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import apiClient from '../../utils/apiClient';
import { Button, Input, Label, Select, FormErrorMessage } from '../../components/ui'; // Import FormErrorMessage
// Removed errorTextStyle import

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
        <div className="space-y-1"> {/* Add spacing */}
          {/* Use Label component (remove formLabelStyle) */}
          <Label htmlFor="resourceId">Resource</Label>
           {/* Use Select component */}
          <Select
            id="resourceId"
            {...register('resourceId', { required: 'Resource is required' })}
            error={!!errors.resourceId} // Pass error prop
            disabled={isSubmitting || isLoadingData || resources.length === 0}
            options={resources.map(r => ({ value: r.id, label: r.name }))}
            placeholder="-- Select Resource --"
          />
           <FormErrorMessage>{errors.resourceId?.message}</FormErrorMessage> {/* Use component */}
            {resources.length === 0 && !isLoadingData && <FormErrorMessage>No resources available. Please create resources first.</FormErrorMessage>} {/* Use component */}
        </div>

        <div className="space-y-1"> {/* Add spacing */}
           {/* Use Label component (remove formLabelStyle) */}
          <Label htmlFor="actionId">Action</Label>
           {/* Use Select component */}
          <Select
            id="actionId"
            {...register('actionId', { required: 'Action is required' })}
            error={!!errors.actionId} // Pass error prop
            disabled={isSubmitting || isLoadingData || actions.length === 0}
            options={actions.map(a => ({ value: a.id, label: a.name }))}
            placeholder="-- Select Action --"
          />
           <FormErrorMessage>{errors.actionId?.message}</FormErrorMessage> {/* Use component */}
            {actions.length === 0 && !isLoadingData && <FormErrorMessage>No actions available. Please create actions first.</FormErrorMessage>} {/* Use component */}
        </div>

        <div className="space-y-1"> {/* Add spacing */}
           {/* Use Label component (remove formLabelStyle) */}
          <Label htmlFor="description">Description (Optional)</Label>
           {/* Use Input component */}
          <Input
            type="text"
            id="description"
            {...register('description')}
            error={!!errors.description} // Pass error prop
            disabled={isSubmitting || isLoadingData}
            placeholder="Optional: Describe what this permission allows"
          />
           <FormErrorMessage>{errors.description?.message}</FormErrorMessage> {/* Use component */}
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