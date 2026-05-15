import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import CitizenLayout from "./components/CitizenLayout.jsx";
import EmployeeLayout from "./components/EmployeeLayout.jsx";
import AdminLayout from "./components/AdminLayout.jsx";

import Services from "./pages/Services.jsx";
import Branches from "./pages/Branches.jsx";
import Slots from "./pages/Slots.jsx";
import Confirm from "./pages/Confirm.jsx";
import Success from "./pages/Success.jsx";

import AuthLogin from "./pages/auth/Login.jsx";
import AuthRegister from "./pages/auth/Register.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";

import CitizenDashboard from "./pages/citizen/Dashboard.jsx";
import CitizenAppointments from "./pages/citizen/Appointments.jsx";
import CitizenConfirmation from "./pages/citizen/Confirmation.jsx";
import CitizenProfile from "./pages/citizen/Profile.jsx";

import EmployeeDashboard from "./pages/employee/Dashboard.jsx";
import EmployeeAppointments from "./pages/employee/Appointments.jsx";
import EmployeeScan from "./pages/employee/Scan.jsx";
import EmployeeProfile from "./pages/employee/Profile.jsx";

import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AdminReports from "./pages/admin/Reports.jsx";
import AdminSlots from "./pages/admin/Slots.jsx";
import AdminAppointments from "./pages/admin/Appointments.jsx";
import AdminLogs from "./pages/admin/Logs.jsx";
import AdminProfile from "./pages/admin/Profile.jsx";
import AdminManage from "./pages/admin/Manage.jsx";

export default function App() {
  return (
    <Routes>
      {/* Auth — own full-screen layout */}
      <Route path="/auth/login" element={<AuthLogin />} />
      <Route path="/auth/register" element={<AuthRegister />} />
      <Route path="/auth/forget-password" element={<ForgetPassword />} />
      <Route path="/auth/reset-password" element={<ResetPassword />} />

      {/* Public booking flow */}
      <Route element={<Layout />}>
        <Route index element={<Services />} />
        <Route path="/branches" element={<Branches />} />
        <Route path="/slots" element={<Slots />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/success" element={<Success />} />
      </Route>

      {/* Citizen area — its own dashboard layout */}
      <Route element={<CitizenLayout />}>
        <Route path="/citizen/dashboard" element={<CitizenDashboard />} />
        <Route path="/citizen/appointments" element={<CitizenAppointments />} />
        <Route path="/citizen/confirmation" element={<CitizenConfirmation />} />
        <Route path="/citizen/profile" element={<CitizenProfile />} />
      </Route>

      {/* Employee area */}
      <Route element={<EmployeeLayout />}>
        <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/appointments" element={<EmployeeAppointments />} />
        <Route path="/employee/scan" element={<EmployeeScan />} />
        <Route path="/employee/profile" element={<EmployeeProfile />} />
      </Route>

      {/* Admin — unified layout for sections 5 + 6 */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/slots" element={<AdminSlots />} />
        <Route path="/admin/appointments" element={<AdminAppointments />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
        <Route path="/admin/manage" element={<AdminManage />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
      </Route>

      {/* Legacy login URLs → unified auth */}
      <Route path="/citizen/login" element={<Navigate to="/auth/login" replace />} />
      <Route path="/employee/login" element={<Navigate to="/auth/login" replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
