import { Container } from '@mui/material';
import React from 'react';
import SignInForm from './components/SignInForm';

const SignInPage: React.FC = () => {
    return (
        <Container>
            <SignInForm />
        </Container>
    );
};

export default SignInPage;