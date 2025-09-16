import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import RootLayout from '../layout/RootLayout';
import CreateEventPage from '../features/create-event/CreateEventPage';
import JoinEventPage from '../features/join-event/JoinEventPage';
import MyEventsPage from '../features/my-events/MyEventsPage';
import config from '../utils/config';
import SignInPage from '../features/sign-in/SignInPage';
import CreateAccountPage from '../features/create-account/CreateAccountPage';
import InviteLinkHandler from '../features/join-event/InviteLinkHandler';
import ScrollToTop from '../components/ScrollToTop';

import { DrawerProvider } from '../context/DrawerProvider';

const AppRouter: React.FC = () => {
    const basename = config.BASE_NAME;
    return (
      <BrowserRouter basename={basename}>
        <DrawerProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Navigate to="/sign-in" replace />} /> {/* Redirect root to sign-in page, for good UX */}
              <Route path="join-event" element={<JoinEventPage />} />
              {/* TODO: disallow access to join-event/:accessCode directly from a link... or rather,
                in this scenario, DO NOT make the API request. Find a way to redirect the user back to the
                page where we ask the user to sign in if theyre not signed in (meaning direct acess is ok if theyre signed in?)
                ... one possible way is by passing a value from create-event/join-event page to join event, and if this value is not present,
                 and they are not authenticated, redirect them to the sign-in page.
              */}
              <Route path='join-event/:accessCode' element={<JoinEventPage />} />
              <Route path="invite/:accessCode" element={<InviteLinkHandler />} />
              <Route path="create-event" element={<CreateEventPage />} />
              <Route path="my-events" element={<MyEventsPage />} />
              <Route path="sign-in" element={<SignInPage />} />
              <Route path="sign-in/:accessCode" element={<SignInPage />} />
              <Route path="create-account" element={<CreateAccountPage />} />
              <Route path="create-account/:accessCode" element={<CreateAccountPage />} />
            
          </Route>
        </Routes>
        </DrawerProvider>
      </BrowserRouter>
    );
};

export default AppRouter;