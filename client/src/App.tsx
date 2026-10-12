import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import OwnerLayout from './layouts/OwnerLayout';
import PortalProvider from './lib/PortalProvider';
import Home from './pages/Home';
import Pets from './pages/Pets';
import { lazy, Suspense } from 'react';
import PetProfile from './pages/PetProfile';
import PetRegistration from './pages/PetRegistration';
import Appointments from './pages/Appointments';
import Care from './pages/Care';
import Assistant from './pages/Assistant';
import CommunityPage from './pages/CommunityPage';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

const PetAnalytics = lazy(() => import('./pages/PetAnalytics'));

export default function App() {
  return (
    <PortalProvider><BrowserRouter>
      <Routes>
        <Route element={<OwnerLayout />}>
          <Route index element={<Home />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />
          <Route path="my-pets" element={<Pets />} />
          <Route path="my-pets/new" element={<PetRegistration />} />
          <Route path="my-pets/:petId" element={<PetProfile />} />
          <Route path="my-pets/:petId/edit" element={<PetRegistration />} />
          <Route path="my-pets/:petId/analytics" element={<Suspense fallback={<p role="status">Loading pet analytics…</p>}><PetAnalytics /></Suspense>} />
          <Route path="appointment" element={<Appointments />} />
          <Route path="care" element={<Care />} />
          <Route path="assistant" element={<Assistant />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter></PortalProvider>
  );
}
