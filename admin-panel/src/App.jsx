import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';
import AdminLayout from './components/layout/AdminLayout.jsx';

import Login from './pages/Login.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

import Dashboard from './pages/Dashboard.jsx';

import ServicesList from './pages/ServicesList.jsx';
import ServiceForm from './pages/ServiceForm.jsx';

import PortfolioList from './pages/PortfolioList.jsx';
import PortfolioForm from './pages/PortfolioForm.jsx';

import BlogList from './pages/BlogList.jsx';
import BlogForm from './pages/BlogForm.jsx';

import TestimonialsList from './pages/TestimonialsList.jsx';
import TestimonialForm from './pages/TestimonialForm.jsx';

import JobsList from './pages/JobsList.jsx';
import JobForm from './pages/JobForm.jsx';
import Applications from './pages/Applications.jsx';

import LeadsList from './pages/LeadsList.jsx';

import UsersList from './pages/UsersList.jsx';
import UserForm from './pages/UserForm.jsx';

import SiteSettings from './pages/SiteSettings.jsx';
import ActivityLogs from './pages/ActivityLogs.jsx';

import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Protected admin area */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />

        {/* Content Editor + Super Admin */}
        <Route element={<RoleRoute allow={['super_admin', 'content_editor']} />}>
          <Route path="services" element={<ServicesList />} />
          <Route path="services/new" element={<ServiceForm />} />
          <Route path="services/:id/edit" element={<ServiceForm />} />

          <Route path="portfolio" element={<PortfolioList />} />
          <Route path="portfolio/new" element={<PortfolioForm />} />
          <Route path="portfolio/:id/edit" element={<PortfolioForm />} />

          <Route path="blog" element={<BlogList />} />
          <Route path="blog/new" element={<BlogForm />} />
          <Route path="blog/:id/edit" element={<BlogForm />} />

          <Route path="testimonials" element={<TestimonialsList />} />
          <Route path="testimonials/new" element={<TestimonialForm />} />
          <Route path="testimonials/:id/edit" element={<TestimonialForm />} />
        </Route>

        {/* HR Manager + Super Admin */}
        <Route element={<RoleRoute allow={['super_admin', 'hr_manager']} />}>
          <Route path="careers/jobs" element={<JobsList />} />
          <Route path="careers/jobs/new" element={<JobForm />} />
          <Route path="careers/jobs/:id/edit" element={<JobForm />} />
          <Route path="careers/applications" element={<Applications />} />
        </Route>

        {/* Leads — visible to Super Admin + Content Editor (per PRD leads mgmt) */}
        <Route element={<RoleRoute allow={['super_admin', 'content_editor', 'hr_manager']} />}>
          <Route path="leads" element={<LeadsList />} />
        </Route>

        {/* Super Admin only */}
        <Route element={<RoleRoute allow={['super_admin']} />}>
          <Route path="users" element={<UsersList />} />
          <Route path="users/new" element={<UserForm />} />
          <Route path="users/:id/edit" element={<UserForm />} />
          <Route path="settings" element={<SiteSettings />} />
          <Route path="logs" element={<ActivityLogs />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
