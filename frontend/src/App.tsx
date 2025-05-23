import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout'; // Import Layout
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage'; // Import HomePage
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import DashboardPage from './pages/DashboardPage'; // Import DashboardPage
// Admin User Pages
import UserListPage from './pages/admin/UserListPage';
import CreateUserPage from './pages/admin/CreateUserPage';
import EditUserPage from './pages/admin/EditUserPage';
import ViewUserPage from './pages/admin/ViewUserPage'; // Import the new view page

// Admin Role Pages
import ViewRolePage from './pages/admin/ViewRolePage'; // Import the new view page

import RoleListPage from './pages/admin/RoleListPage';
import CreateRolePage from './pages/admin/CreateRolePage';
import ViewPermissionPage from './pages/admin/ViewPermissionPage'; // Import the new view page

import EditRolePage from './pages/admin/EditRolePage';
// Admin Permission Pages
import CreatePermissionPage from './pages/admin/CreatePermissionPage'; // Import CreatePermissionPage
import EditPermissionPage from './pages/admin/EditPermissionPage'; // Import the new page

// Admin Resource Pages
import ResourceListPage from './pages/admin/ResourceListPage';
import CreateResourcePage from './pages/admin/CreateResourcePage';
import EditResourcePage from './pages/admin/EditResourcePage';
// Admin Action Pages
import ActionListPage from './pages/admin/ActionListPage';
import CreateActionPage from './pages/admin/CreateActionPage';
import EditActionPage from './pages/admin/EditActionPage';
import PermissionListPage from './pages/admin/PermissionListPage'; // Import PermissionListPage
import './App.css';

function App() {
  return (
    <Routes>
      {/* Routes that use the main Layout */}
      <Route path="/" element={<Layout />}>
        {/* Public routes within Layout */}
        <Route index element={<HomePage />} /> {/* index route for '/' */}
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegistrationPage />} />

        {/* --- Protected Routes --- */}

        {/* Dashboard is accessible to all authenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>

        {/* Routes accessible by ADMIN and MODERATOR - Use ROLE_ prefix */}
          {/* Add route for viewing a specific user */}
          <Route path="admin/users/view/:userId" element={<ViewUserPage />} />

        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MODERATOR']} />}>
          {/* User Management */}
          <Route path="admin/users" element={<UserListPage />} />
          <Route path="admin/users/create" element={<CreateUserPage />} />
          <Route path="admin/users/edit/:userId" element={<EditUserPage />} />
          {/* Add route for viewing a specific role */}
          <Route path="admin/roles/view/:roleId" element={<ViewRolePage />} />

        </Route>
          {/* Add route for viewing a specific permission */}
          <Route path="admin/permissions/view/:permissionId" element={<ViewPermissionPage />} />


        {/* Routes accessible only by ADMIN - Use ROLE_ prefix */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          {/* Role Management */}
          <Route path="admin/roles" element={<RoleListPage />} />
          <Route path="admin/roles/create" element={<CreateRolePage />} />
          <Route path="admin/roles/edit/:roleId" element={<EditRolePage />} />
          {/* Permission Management */}
          <Route path="admin/permissions" element={<PermissionListPage />} />
          {/* Add route for editing a specific permission */}
          <Route path="admin/permissions/edit/:permissionId" element={<EditPermissionPage />} />

          {/* Moved CreatePermissionPage inside ADMIN-only block */}
          <Route path="admin/permissions/create" element={<CreatePermissionPage />} />
          {/* Add other ADMIN-only protected routes here later */}
          {/* Action Management */}
          <Route path="admin/actions" element={<ActionListPage />} />
          <Route path="admin/actions/create" element={<CreateActionPage />} />
          <Route path="admin/actions/edit/:actionId" element={<EditActionPage />} />
          {/* Resource Management */}
          <Route path="admin/resources" element={<ResourceListPage />} />
          <Route path="admin/resources/create" element={<CreateResourcePage />} />
          <Route path="admin/resources/edit/:resourceId" element={<EditResourcePage />} />
        </Route>

        {/* --- End Protected Routes --- */}

        {/* Optional: Add a 404 Not Found route within Layout */}
        <Route path="*" element={<div>Page Not Found (within Layout)</div>} />
      </Route>

      {/* Optional: Routes outside the main Layout (e.g., a dedicated minimal login page) */}
      {/* <Route path="/minimal-login" element={<MinimalLoginPage />} /> */}

    </Routes>
  );
}

export default App;
