import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import RootLayout from '../layout/RootLayout';
import CreateEventPage from '../features/create-event/CreateEventPage';
import JoinEventPage from '../features/join-event/JoinEventPage';
import MyEventsPage from '../features/my-events/MyEventsPage';
import config from '../utils/config';
import SignInPage from '../features/sign-in/SignInPage';
import CreateAccountPage from '../features/create-account/CreateAccountPage';

const AppRouter: React.FC = () => {
    const basename = config.BASE_NAME;
    return (
      <BrowserRouter basename={basename}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Navigate to="/sign-in" replace />} /> {/* Redirect root to sign-in page, for good UX */}
            <Route path="join-event" element={<JoinEventPage />} />
            <Route path='join-event/:accessCode' element={<JoinEventPage />} />
            <Route path="create-event" element={<CreateEventPage />} />
            <Route path="my-events" element={<MyEventsPage />} />
            <Route path="sign-in" element={<SignInPage />} />
            <Route path="create-account" element={<CreateAccountPage />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    );
};

export default AppRouter;