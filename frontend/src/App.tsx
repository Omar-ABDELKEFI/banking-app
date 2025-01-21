import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DashboardPage from './pages/DashboardPage';
import ClientsPage from './pages/ClientsPage';
import AccountsPage from './pages/AccountsPage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { theme } from './theme';
import CreateClient from './pages/clients/CreateClient';
import EditClientPage from './pages/EditClientPage';
import ClientPreviewUpdate from './pages/clients/ClientPreviewUpdate';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/" element={
        <PrivateRoute>
          <Layout>
            <DashboardPage />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/clients" element={
        <PrivateRoute>
          <Layout>
            <ClientsPage />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/accounts" element={
        <PrivateRoute>
          <Layout>
            <AccountsPage />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/clients/new" element={
        <PrivateRoute>
          <Layout>
            <CreateClient />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/clients/edit/:id" element={
        <PrivateRoute>
          <Layout>
            <EditClientPage />
          </Layout>
        </PrivateRoute>
      } />
      <Route path="/clients/preview-update" element={
        <PrivateRoute>
          <Layout>
            <ClientPreviewUpdate />
          </Layout>
        </PrivateRoute>
      } />
      {/* Catch-all route for not found paths - must be the last route */}
      <Route path="*" element={
        <Navigate to="/" replace />
      } />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <CssBaseline />
        <BrowserRouter>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
