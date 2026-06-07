import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { HouseProvider } from './contexts/HouseContext';
import { ToastProvider } from './components/UI/Toast';
import { AppLayout } from './components/Layout/AppLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Houses } from './pages/Houses';
import { Members } from './pages/house/Members';
import { Catalog } from './pages/house/Catalog';
import { Preferences } from './pages/house/Preferences';
import { Schedule } from './pages/house/Schedule';
import { Reports } from './pages/house/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <HouseProvider>
          <ToastProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route element={<AppLayout />}>
                <Route path="/houses" element={<Houses />} />
                <Route path="/houses/:houseId/members" element={<Members />} />
                <Route path="/houses/:houseId/catalog" element={<Catalog />} />
                <Route path="/houses/:houseId/preferences" element={<Preferences />} />
                <Route path="/houses/:houseId/schedule" element={<Schedule />} />
                <Route path="/houses/:houseId/reports" element={<Reports />} />
              </Route>
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ToastProvider>
        </HouseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
