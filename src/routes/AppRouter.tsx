import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import RootLayout from '../layout/RootLayout';
import CreateEventPage from '../features/create-event/CreateEventPage';
import JoinEventPage from '../features/join-event/JoinEventPage';
import MyEventsPage from '../features/my-events/MyEventsPage';
import config from '../utils/config';

const AppRouter: React.FC = () => {
    const basename = config.VITE_BASE_NAME;
    return (
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Navigate to="/join-event" replace />} /> {/* Redirect root to join event page, for good UX */}
            <Route path="join-event" element={<JoinEventPage />} />
            <Route path="create-event" element={<CreateEventPage />} />
            <Route path="my-events" element={<MyEventsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
};

export default AppRouter;