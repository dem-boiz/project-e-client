import React, { useEffect } from 'react';
import CreateEventForm from './components/CreateEventForm';
import Container from '@mui/material/Container';
import { useAuth } from '../../hooks/useAuth';
import SignInForm from '../sign-in/components/SignInForm'
const CreateEventPage: React.FC = () => {
  const authContext = useAuth();
  useEffect(() => {
  }, [authContext]);
  return (
    <Container>
      {authContext.isAuthenticated() ? <CreateEventForm /> : <SignInForm />}
    </Container>
  );
};

export default CreateEventPage;