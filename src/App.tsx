import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import PostDetailPage from './pages/PostDetailPage';
import DashboardPage from './pages/admin/DashboardPage';
import PortfolioAdmin from './pages/admin/PortfolioAdmin';
import BlogAdmin from './pages/admin/BlogAdmin';
import ProfileAdmin from './pages/admin/ProfileAdmin';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#fafafa] selection:bg-black selection:text-white font-sans text-[#1a1a1a]">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/blog/:slug" element={<PostDetailPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<ProfileAdmin />} />
              <Route path="portfolio" element={<PortfolioAdmin />} />
              <Route path="blog" element={<BlogAdmin />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
