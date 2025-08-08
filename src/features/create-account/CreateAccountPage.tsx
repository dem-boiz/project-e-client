import { Container } from '@mui/material';
import React from 'react';
import CreateAccountForm from './components/CreateAccountForm';

const CreateAccountPage: React.FC = () => {
    return (
        <Container>
            <CreateAccountForm />
        </Container>
    );
};

export default CreateAccountPage;