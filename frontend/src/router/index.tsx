import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// Auth pages (eager — needed immediately)
import LoginPage          from '../features/auth/pages/LoginPage';
import SignupPage         from '../features/auth/pages/SignupPage';
import OAuthSuccess       from '../features/auth/pages/OAuthSuccess';
import ForgotPasswordPage from '../features/auth/pages/ForgotPasswordPage';
import NotFoundPage       from '../features/auth/pages/NotFoundPage';

// App pages (lazy — only loaded after login)
const HomePage            = lazy(() => import('../features/home/pages/HomePage'));
const ChatPage            = lazy(() => import('../features/chat/pages/ChatPage'));
const ProfilePage         = lazy(() => import('../features/profile/pages/ProfilePage'));
const CreateListingPage   = lazy(() => import('../features/listings/pages/CreateListingPage'));
const ListingDetailPage   = lazy(() => import('../features/listings/pages/ListingDetailPage'));
const BuyerDashboard      = lazy(() => import('../features/dashboard/pages/BuyerDashboard'));
const SellerDashboard     = lazy(() => import('../features/dashboard/pages/SellerDashboard'));
const WholesalerDashboard = lazy(() => import('../features/dashboard/pages/WholesalerDashboard'));

const Spinner = () => (
  <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#000' }}>
    <div style={{ width:32, height:32, borderRadius:'50%', border:'3px solid rgba(34,197,94,0.2)', borderTopColor:'#22c55e', animation:'spin 0.7s linear infinite' }} />
  </div>
);

export default function Router() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* ── Public / Auth ── */}
          <Route path="/login"           element={<LoginPage />} />
          <Route path="/register"        element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password"  element={<ForgotPasswordPage />} />
          <Route path="/oauth/success"   element={<OAuthSuccess />} />

          {/* ── App ── */}
          <Route path="/home"            element={<HomePage />} />
          <Route path="/chat"            element={<ChatPage />} />
          <Route path="/chat/:id"        element={<ChatPage />} />
          <Route path="/profile/:id"     element={<ProfilePage />} />
          <Route path="/listings/new"    element={<CreateListingPage />} />
          <Route path="/listings/:id"    element={<ListingDetailPage />} />

          {/* ── Role dashboards ── */}
          <Route path="/buyer/dashboard"       element={<BuyerDashboard />} />
          <Route path="/seller/dashboard"      element={<SellerDashboard />} />
          <Route path="/wholesaler/dashboard"  element={<WholesalerDashboard />} />

          {/* ── Redirects & 404 ── */}
          <Route path="/"  element={<Navigate to="/home" replace />} />
          <Route path="*"  element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
