import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastContainer } from './components/common/Toast';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import AboutPage from './pages/public/AboutPage';
import ServicesPage from './pages/public/ServicesPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';

// Customer Pages
import CustomerLayout from './pages/customer/CustomerLayout';
import CustomerOverview from './pages/customer/CustomerOverview';
import AccountsPage from './pages/customer/AccountsPage';
import AccountDetailsPage from './pages/customer/AccountDetailsPage';
import TransferPage from './pages/customer/TransferPage';
import BeneficiariesPage from './pages/customer/BeneficiariesPage';
import TransactionHistoryPage from './pages/customer/TransactionHistoryPage';
import CardsPage from './pages/customer/CardsPage';
import LoansPage from './pages/customer/LoansPage';
import FixedDepositsPage from './pages/customer/FixedDepositsPage';
import BillPaymentsPage from './pages/customer/BillPaymentsPage';
import NotificationsPage from './pages/customer/NotificationsPage';
import ProfilePage from './pages/customer/ProfilePage';
import SecurityPage from './pages/customer/SecurityPage';

// Staff Pages
import StaffLayout from './pages/staff/StaffLayout';
import StaffOverview from './pages/staff/StaffOverview';
import StaffCustomers from './pages/staff/StaffCustomers';
import StaffAccounts from './pages/staff/StaffAccounts';
import StaffKYC from './pages/staff/StaffKYC';
import StaffLoans from './pages/staff/StaffLoans';
import StaffTransactions from './pages/staff/StaffTransactions';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBranches from './pages/admin/AdminBranches';
import AdminBroadcast from './pages/admin/AdminBroadcast';
import AdminAuditLogs from './pages/admin/AdminAuditLogs';
import AdminReports from './pages/admin/AdminReports';

// Role-Based Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs">
        Verifying Security Credentials...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective authorized home
    if (user.role === 'admin') return <Navigate to="/admin" replace />;
    if (user.role === 'employee') return <Navigate to="/staff" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />

            {/* Dashboard 1 — Customer */}
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['customer']}>
                  <CustomerLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<CustomerOverview />} />
              <Route path="accounts" element={<AccountsPage />} />
              <Route path="accounts/:id" element={<AccountDetailsPage />} />
              <Route path="transfer" element={<TransferPage />} />
              <Route path="beneficiaries" element={<BeneficiariesPage />} />
              <Route path="transactions" element={<TransactionHistoryPage />} />
              <Route path="cards" element={<CardsPage />} />
              <Route path="loans" element={<LoansPage />} />
              <Route path="fixed-deposits" element={<FixedDepositsPage />} />
              <Route path="bills" element={<BillPaymentsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="security" element={<SecurityPage />} />
            </Route>

            {/* Dashboard 2 — Staff */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['employee', 'admin']}>
                  <StaffLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StaffOverview />} />
              <Route path="customers" element={<StaffCustomers />} />
              <Route path="accounts" element={<StaffAccounts />} />
              <Route path="kyc" element={<StaffKYC />} />
              <Route path="loans" element={<StaffLoans />} />
              <Route path="transactions" element={<StaffTransactions />} />
            </Route>

            {/* Dashboard 3 — Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="branches" element={<AdminBranches />} />
              <Route path="broadcast" element={<AdminBroadcast />} />
              <Route path="audit-logs" element={<AdminAuditLogs />} />
              <Route path="reports" element={<AdminReports />} />
            </Route>

            {/* Catch All Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;