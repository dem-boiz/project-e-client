import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Container,
} from '@mui/material';
import { toast } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';

// Zod schema for form validation
const createAccountSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
    .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
    .regex(/(?=.*\d)/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CreateAccountFormData = z.infer<typeof createAccountSchema>;

const CreateAccountForm: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CreateAccountFormData>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: CreateAccountFormData) => {
    setIsLoading(true);
    try {
      console.log('Creating account:', { username: data.username, email: data.email });
      // TODO: Implement actual API call
      // const response = await createAccount({ username: data.username, email: data.email, password: data.password });
      
      // Mock successful account creation
      const mockUser = { id: 'user_123', name: data.username };
      const mockToken = 'mock_jwt_token_123';
      
      login(mockUser, mockToken);
      toast.success('Account created successfully!');
      navigate('/create-event'); // Navigate to create event page after successful account creation
    } catch (error) {
      console.error('Failed to create account:', error);
      toast.error('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignInClick = () => {
    navigate('/sign-in'); // TODO: Update with actual sign-in route
  };

  return (
    <Box
      sx={{
        height: '100vh',
        scrollbarGutter: 'stable',
        backgroundColor: 'background.default',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        padding: { xs: 1, sm: 1, md: 2, lg: 2 },
        overflow: 'auto',
      }}
    >
      <Container 
        maxWidth="sm" 
        sx={{ 
          padding: { xs: 1, sm: 1, md: 2, lg: 2 },
          marginTop: { xs: 10, sm: 12, md: 20, lg: 20 },
          height: 'fit-content',
          marginBottom: '100px'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 2, sm: 3, md: 4 },
            backgroundColor: 'background.paper',
            borderRadius: 2,
          }}
        >
          <Stack spacing={4} alignItems="center">
            {/* Title */}
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 100,
                letterSpacing: '0.2em',
                color: 'text.primary',
                textAlign: 'center',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                marginBottom: 2,
              }}
            >
              CREATE HOST ACCOUNT
            </Typography>

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit(onSubmit)}
              sx={{ width: '100%' }}
            >
              <Stack spacing={3}>
                {/* Username */}
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  placeholder="Enter your username"
                  {...register("username")}
                  error={!!errors.username}
                  helperText={errors.username?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                />

                {/* Email */}
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  variant="outlined"
                  placeholder="Enter your email address"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                />

                {/* Password */}
                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  variant="outlined"
                  placeholder="Enter your password"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                />

                {/* Confirm Password */}
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type="password"
                  variant="outlined"
                  placeholder="Confirm your password"
                  {...register("confirmPassword")}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword?.message}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                  }}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isLoading}
                  sx={{
                    width: '100%',
                    padding: '12px 24px',
                    fontSize: '1rem',
                    textTransform: 'none',
                    marginTop: 2,
                  }}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>

                {/* Sign In Link */}
                <Typography
                  onClick={handleSignInClick}
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    marginTop: 2,
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline',
                    },
                    transition: 'color 0.2s ease-in-out',
                  }}
                >
                  Already have an account? Sign in
                </Typography>
              </Stack>
            </Box>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default CreateAccountForm;