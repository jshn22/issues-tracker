import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ReportIssuePage from './pages/ReportIssuePage';
import IssueDetailPage from './pages/IssueDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './contexts/AuthContext';

function App() {
  const { user, logout } = useContext(AuthContext);
  const HeaderNav = () => {
    const location = useLocation();
    const onReportPage = location.pathname === '/report';
    return (
      <header className="app-header">
        <div className="logo">
          <Link to="/">
            <span style={{ color: '#1976d2', fontWeight: 800, marginRight: 8 }}>Civic-Assist</span>
          </Link>
        </div>
        <nav className="main-nav">
          {user ? (
            <>
              <span>Welcome, {user.username || user.email}</span>
              {user.role === 'Admin' && <Link to="/admin" className="btn">Admin Dashboard</Link>}
              {onReportPage ? (
                <Link to="/" className="btn btn-primary" style={{ marginRight: 12 }}>Home</Link>
              ) : (
                <Link to="/report" className="btn btn-primary">Report New Issue</Link>
              )}
              <button onClick={logout} className="btn">Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Login / Sign Up</Link>
          )}
        </nav>
      </header>
    );
  };

  return (
    <Router>
      <div className="app-container">
        <HeaderNav />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot" element={<ForgotPasswordPage />} />
            <Route path="/reset/:token" element={<ResetPasswordPage />} />
            <Route path="/issue/:issueId" element={<IssueDetailPage />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/report" element={<ReportIssuePage />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
