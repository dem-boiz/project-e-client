import React, { useEffect } from 'react';
import CreateEventForm from './components/CreateEventForm';
import SignInForm from '../../components/SignInForm';
import Container from '@mui/material/Container';
import { useAuth } from '../../hooks/useAuth';
import CreateAccountForm from '../../components/CreateAccountForm';

const CreateEventPage: React.FC = () => {
  const authContext = useAuth();
  useEffect(() => {
    console.log('Auth context:', authContext.isAuthenticated());
  }, [authContext]);
  return (
    <Container>
      {authContext.isAuthenticated() ? <CreateEventForm /> : <CreateAccountForm />}
    </Container>
  );
};

export default CreateEventPage;