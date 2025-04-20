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
interface Permission {
  id: string;
  name: string;
  description?: string;
  resource?: { name: string };
  action?: { name: string };
}
interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}
type EditRoleFormData = {
  description: string;
};

// Removed local style constants

const EditRolePage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  const [roleName, setRoleName] = useState('');
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [assignedPermissionIds, setAssignedPermissionIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [permissionToggleLoading, setPermissionToggleLoading] = useState<Record<string, boolean>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors: formErrors, isSubmitting: isDescriptionSubmitting }
  } = useForm<EditRoleFormData>();

  useEffect(() => {
    const fetchData = async () => {
       if (!roleId) {
        setApiError("Role ID not found in URL.");
        setLoading(false);
        return;
      }
      setLoading(true);
      setApiError(null);
      try {
        const [roleResponse, permissionsResponse] = await Promise.all([
          apiClient.get<Role>(`/roles/${roleId}`),
          apiClient.get<Permission[]>('/permissions')
        ]);

        const fetchedRole = roleResponse.data;
        const fetchedPermissions = permissionsResponse.data || [];

        if (fetchedRole) {
          setRoleName(fetchedRole.name || '');
          reset({ description: fetchedRole.description || '' });
          setAssignedPermissionIds(new Set(fetchedRole.permissions?.map(p => p.id) || []));
        } else {
          throw new Error("Role data not found.");
        }
        setAllPermissions(fetchedPermissions);

      } catch (err) {
        console.error('Error fetching data for edit:', err);
        let errorMessage = 'Failed to load role data or permissions.';
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
  }, [roleId, reset]);

  const onDescriptionSubmit: SubmitHandler<EditRoleFormData> = async (data) => {
     setApiError(null);
     if (!roleId) { setApiError("Role ID is missing."); return; }
     console.log('Attempting to update role description:', roleId, data);
     try {
       const payload = { description: data.description.trim() };
       await apiClient.put(`/roles/${roleId}`, payload);
       alert(`Role "${roleName}" description updated successfully!`);
     } catch (err) {
       console.error(`Error updating role ${roleId}:`, err);
       let errorMessage = 'Failed to update role description.';
       if (err instanceof AxiosError) {
         errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
       } else if (err instanceof Error) {
         errorMessage = err.message;
       }
       setApiError(errorMessage);
     }
  };

  const handlePermissionChange = async (permissionId: string, isChecked: boolean) => {
      if (!roleId) return;
      setApiError(null);
      setPermissionToggleLoading(prev => ({ ...prev, [permissionId]: true }));
      const url = `/roles/${roleId}/permissions/${permissionId}`;
      try {
          if (isChecked) {
              await apiClient.post(url);
              setAssignedPermissionIds(prev => new Set(prev).add(permissionId));
          } else {
              await apiClient.delete(url);
              setAssignedPermissionIds(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(permissionId);
                  return newSet;
              });
          }
      } catch (err) {
          console.error(`Error toggling permission ${permissionId} for role ${roleId}:`, err);
          let errorMessage = `Failed to ${isChecked ? 'assign' : 'revoke'} permission.`;
           if (err instanceof AxiosError) {
               errorMessage = err.response?.data?.message || err.response?.data?.error || err.message;
           } else if (err instanceof Error) {
               errorMessage = err.message;
           }
           setApiError(errorMessage);
           // Revert checkbox state on error
           setAssignedPermissionIds(prev => {
                const currentSet = new Set(prev);
                if (isChecked) currentSet.delete(permissionId); else currentSet.add(permissionId);
                return currentSet;
           });
      } finally {
          setPermissionToggleLoading(prev => ({ ...prev, [permissionId]: false }));
      }
  };

  if (loading) {
    return <p className="text-center mt-8">Loading role data and permissions...</p>;
  }

   if (apiError && !isDescriptionSubmitting && Object.values(permissionToggleLoading).every(v => !v)) {
     return <p className="text-red-600 text-center mt-8">Error loading data: {apiError}</p>;
  }

  const groupedPermissions = allPermissions.reduce((acc, permission) => {
      const resourceName = permission.resource?.name || 'Other';
      if (!acc[resourceName]) acc[resourceName] = [];
      acc[resourceName].push(permission);
      return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="max-w-2xl mx-auto"> {/* Wider container */}
      <h1 className="text-2xl font-bold mb-4">Edit Role: {roleName} <span className="text-sm text-gray-500">(ID: {roleId})</span></h1>
       <div className="mb-4">
         {/* Use common linkStyle */}
         <Link to="/admin/roles" className={linkStyle}>&larr; Back to Role List</Link>
      </div>

      {/* Form for Role Description */}
      <form onSubmit={handleSubmit(onDescriptionSubmit)} className="space-y-4 bg-white p-6 rounded shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-3">Role Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
           {/* Use Label component */}
          <Label htmlFor="roleNameDisplay" className={`${formLabelStyle} md:col-span-1`}>Role Name:</Label>
           {/* Use Input component (read-only) */}
          <Input type="text" id="roleNameDisplay" value={roleName} readOnly className={`${formInputStyle} md:col-span-2 bg-gray-100`} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Use Label component */}
          <Label htmlFor="description" className={`${formLabelStyle} md:col-span-1 pt-2`}>Description:</Label>
          <div className="md:col-span-2">
             {/* Use Input component for now */}
            <Input
              id="description"
              // rows={3} // Input doesn't have rows, use Textarea component when available
              className={`${formInputStyle} ${formErrors.description ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              {...register("description")}
              disabled={isDescriptionSubmitting}
              placeholder="Optional: Describe the role's purpose"
            />
             {/* Use common errorTextStyle */}
            {formErrors.description && <p className={errorTextStyle}>{formErrors.description.message}</p>}
          </div>
        </div>
        {/* Show API error from description submission */}
        {apiError && isDescriptionSubmitting && <p className="text-red-600 text-sm mt-2 text-center">{apiError}</p>}
        <div className="text-right">
             {/* Use Button component */}
            <Button type="submit" disabled={isDescriptionSubmitting}>
                {isDescriptionSubmitting ? 'Updating...' : 'Update Description'}
            </Button>
        </div>
      </form>

      {/* Permission Assignment Section */}
      <div className="bg-white p-6 rounded shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-3">Assign Permissions</h2>
        {/* Show API error from permission toggle */}
        {apiError && !isDescriptionSubmitting && Object.values(permissionToggleLoading).some(v => v) && <p className="text-red-600 text-sm mb-3">{apiError}</p>}

        <div className="space-y-4">
            {Object.entries(groupedPermissions).sort(([resA], [resB]) => resA.localeCompare(resB)).map(([resourceName, permissions]) => (
                <div key={resourceName} className="border border-gray-200 rounded p-4">
                    <h3 className="text-lg font-medium mb-2 border-b pb-1">{resourceName}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                        {permissions.sort((a,b) => (a.action?.name ?? a.name).localeCompare(b.action?.name ?? b.name)).map((permission) => (
                            <div key={permission.id} className="flex items-center">
                                <input // Keep custom checkbox for now
                                    id={`perm-${permission.id}`}
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mr-2 disabled:opacity-50"
                                    checked={assignedPermissionIds.has(permission.id)}
                                    onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                                    disabled={permissionToggleLoading[permission.id]}
                                />
                                <label htmlFor={`perm-${permission.id}`} className={`text-sm ${permissionToggleLoading[permission.id] ? 'text-gray-400' : 'text-gray-700'}`}>
                                    {permission.action?.name || permission.name}
                                    {permissionToggleLoading[permission.id] && <em className="ml-2 text-xs">(...)</em>}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EditRolePage;