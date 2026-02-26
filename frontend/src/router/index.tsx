import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage           from '../features/auth/pages/LoginPage';
import SignupPage          from '../features/auth/pages/SignupPage';
import OAuthSuccess        from '../features/auth/pages/OAuthSuccess';
import ForgotPasswordPage  from '../features/auth/pages/Forgotpasswordpage';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"           element={<LoginPage />} />
        <Route path="/register"        element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password"  element={<ForgotPasswordPage />} />
        <Route path="/oauth/success"   element={<OAuthSuccess />} />
        <Route path="*"                element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}