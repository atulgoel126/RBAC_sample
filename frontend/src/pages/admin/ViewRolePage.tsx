import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../utils/apiClient';
import { toast } from 'react-toastify';

// Interface matching PermissionDto from backend
interface PermissionDetails {
  id: number;
  name: string; // e.g., "DOCUMENT:READ"
  description: string | null;
  resourceName: string;
  actionName: string;
}

// Interface matching RoleResponseDto from backend
interface RoleDetails {
  id: number;
  name: string;
  description: string | null;
  createdAt: string; // Assuming ISO string format
  updatedAt: string; // Assuming ISO string format
  permissions: PermissionDetails[]; // Array of permissions
}

const ViewRolePage: React.FC = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();
  const [role, setRole] = useState<RoleDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get<RoleDetails>(`/roles/${roleId}`);
        // Sort permissions alphabetically by name for consistent display
        response.data.permissions?.sort((a, b) => a.name.localeCompare(b.name));
        setRole(response.data);
      } catch (err: any) {
        console.error("Error fetching role details:", err);
        const message = err.response?.data?.message || "Failed to load role details.";
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    if (roleId) {
      fetchRole();
    } else {
      setError("Role ID is missing from URL.");
      setLoading(false);
    }
  }, [roleId]);

  // Helper to format date/time strings
  const formatDateTime = (dateTimeString: string | undefined) => {
    if (!dateTimeString) return 'N/A';
    try {
      return new Date(dateTimeString).toLocaleString();
    } catch (e) {
      return 'Invalid Date';
    }
  };

  // Tailwind classes
  const cardStyle = "bg-white shadow overflow-hidden sm:rounded-lg mb-6"; // Added margin bottom
  const headerStyle = "px-4 py-5 sm:px-6 border-b border-gray-200";
  const titleStyle = "text-lg leading-6 font-medium text-gray-900";
  const contentStyle = "px-4 py-5 sm:p-0";
  const dlStyle = "sm:divide-y sm:divide-gray-200";
  const dtStyle = "text-sm font-medium text-gray-500";
  const ddStyle = "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2";
  const rowStyle = "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6";
  const buttonStyle = "inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline";
  const listStyle = "list-disc pl-5 space-y-1"; // For permissions list


  if (loading) {
    return <div className="text-center p-6">Loading role details...</div>;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button onClick={() => navigate('/admin/roles')} className={buttonStyle}>
          Back to Role List
        </button>
      </div>
    );
  }

  if (!role) {
     return <div className="text-center p-6">Role not found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
       <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Role Details</h1>
            <button onClick={() => navigate('/admin/roles')} className={buttonStyle}>
                Back to Role List
            </button>
       </div>

      {/* Role Information Card */}
      <div className={cardStyle}>
        <div className={headerStyle}>
          <h3 className={titleStyle}>Role Information</h3>
        </div>
        <div className={contentStyle}>
          <dl className={dlStyle}>
            <div className={rowStyle}>
              <dt className={dtStyle}>Role ID</dt>
              <dd className={`${ddStyle} font-mono text-xs`}>{role.id}</dd>
            </div>
            <div className={rowStyle}>
              <dt className={dtStyle}>Name</dt>
              <dd className={ddStyle}>{role.name}</dd>
            </div>
            <div className={rowStyle}>
              <dt className={dtStyle}>Description</dt>
              <dd className={ddStyle}>{role.description || <span className="text-gray-500 italic">No description provided</span>}</dd>
            </div>
            <div className={rowStyle}>
              <dt className={dtStyle}>Created At</dt>
              <dd className={ddStyle}>{formatDateTime(role.createdAt)}</dd>
            </div>
            <div className={rowStyle}>
              <dt className={dtStyle}>Last Updated At</dt>
              <dd className={ddStyle}>{formatDateTime(role.updatedAt)}</dd>
            </div>
             <div className={`${rowStyle} border-t border-gray-200`}>
                <dt className={dtStyle}>Actions</dt>
                <dd className={`${ddStyle} space-x-3`}>
                     <Link to={`/admin/roles/edit/${role.id}`} className={linkStyle}>Edit Role & Permissions</Link>
                     {/* Add delete button here if needed, similar to list page */}
                </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Assigned Permissions Card */}
      <div className={cardStyle}>
        <div className={headerStyle}>
          <h3 className={titleStyle}>Assigned Permissions ({role.permissions?.length || 0})</h3>
        </div>
        <div className="px-4 py-5 sm:px-6">
          {role.permissions && role.permissions.length > 0 ? (
            <ul className={listStyle}>
              {role.permissions.map(permission => (
                <li key={permission.id} className="text-sm text-gray-700">
                  <span className="font-medium">{permission.name}</span>
                  {permission.description && (
                    <span className="text-gray-500 italic ml-2"> - {permission.description}</span>
                  )}
                   {/* Optional: Link to view permission details */}
                   {/* <Link to={`/admin/permissions/view/${permission.id}`} className={`${linkStyle} ml-2`}>(View)</Link> */}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-500">No permissions assigned to this role.</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default ViewRolePage;