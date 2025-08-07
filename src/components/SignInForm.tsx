import React from 'react';

interface SignInFormProps {
    onSubmit?: (values: { email: string; password: string }) => void;
}

const SignInForm: React.FC<SignInFormProps> = () => {
    return (
        <div className="sign-in-form">
            {/* Form content will go here */}
        </div>
    );
};

export default SignInForm;