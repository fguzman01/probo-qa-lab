import { Navigate, Route, Routes } from 'react-router';
import { RequireAuth } from './components/RequireAuth';
import { LoginPage } from './pages/LoginPage';
import { StatusPage } from './pages/StatusPage';
import { StoriesPage } from './pages/StoriesPage';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/estado" element={<StatusPage />} />
      <Route
        path="/historias"
        element={
          <RequireAuth>
            <StoriesPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/historias" replace />} />
    </Routes>
  );
}
