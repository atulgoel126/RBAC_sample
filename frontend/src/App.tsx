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
// Admin Role Pages
import RoleListPage from './pages/admin/RoleListPage';
import CreateRolePage from './pages/admin/CreateRolePage';
import EditRolePage from './pages/admin/EditRolePage';
// Admin Permission Pages
import CreatePermissionPage from './pages/admin/CreatePermissionPage'; // Import CreatePermissionPage
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
        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_MODERATOR']} />}>
          {/* User Management */}
          <Route path="admin/users" element={<UserListPage />} />
          <Route path="admin/users/create" element={<CreateUserPage />} />
          <Route path="admin/users/edit/:userId" element={<EditUserPage />} />
        </Route>

        {/* Routes accessible only by ADMIN - Use ROLE_ prefix */}
        <Route element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
          {/* Role Management */}
          <Route path="admin/roles" element={<RoleListPage />} />
          <Route path="admin/roles/create" element={<CreateRolePage />} />
          <Route path="admin/roles/edit/:roleId" element={<EditRolePage />} />
          {/* Permission Management */}
          <Route path="admin/permissions" element={<PermissionListPage />} />
          {/* Moved CreatePermissionPage inside ADMIN-only block */}
          <Route path="admin/permissions/create" element={<CreatePermissionPage />} />
          {/* Add other ADMIN-only protected routes here later */}
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
