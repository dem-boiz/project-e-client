import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Controller, useForm } from 'react-hook-form';
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
  IconButton,
  InputAdornment,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks/useAuth';
import { requestLogin } from '../../../service/api/api.service';

// Zod schema for form validation
const signInSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

type SignInFormData = z.infer<typeof signInSchema>;

interface SignInFormProps {
    onSubmit?: (values: { email: string; password: string }) => void;
}

const SignInForm: React.FC<SignInFormProps> = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, control, formState: { errors } } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false, // Default to remember me checked
    },
  });

  const handleFormSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    
    try {
      const response = await requestLogin(data);
      console.log('sign in response:', response);
      login({
        name: response.name,
        id: response.user_id,
        token_type: response.token_type,
        email: response.email,
        access_token: response.access_token
      }, data.rememberMe);

      toast.success(`Successfully signed in. Welcome back ${response.name}!`);
      // Navigate back or to home page
      navigate('/my-events');
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
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
                p: 4, 
                borderRadius: 2,
                backgroundColor: 'background.paper'
            }}
            >
            <Box component="form" onSubmit={handleSubmit(handleFormSubmit)}>
                <Stack spacing={3}>
                    <Typography
                    variant="h3"
                    component="h1"
                    sx={{
                        fontWeight: 100,
                        letterSpacing: '0.2em',
                        color: 'text.primary',
                        textAlign: 'center',
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                        marginBottom: 2,
                    }}
                    >
                    SIGN IN
                    </Typography>

                <TextField
                    {...register('email')}
                    label="Email"
                    type="email"
                    fullWidth
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                    },
                    }}
                />

                <TextField
                    {...register('password')}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        ),
                        }
                    }}
                    sx={{
                    '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                    },
                    }}
                />


                <Controller
                    name="rememberMe"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={value}
                                    onChange={onChange}
                                    color="primary"
                                />
                            }
                            label="Remember me"
                            sx={{
                                mt: 1,
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '0.9rem',
                                },
                            }}
                        />
                    )}
                />


                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={isLoading}
                    sx={{
                    mt: 3,
                    py: 1.5,
                    borderRadius: 1,
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    }}
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Don't have an account?{' '}
                        <Typography 
                            component="span" 
                            color="primary" 
                            sx={{ 
                                fontWeight: 'medium', 
                                cursor: 'pointer',
                                '&:hover': { textDecoration: 'underline' }
                            }}
                            onClick={() => navigate('/create-account')}
                        >
                            Sign up now
                        </Typography>
                    </Typography>
                </Box>
                </Stack>
            </Box>
            </Paper>
        </Container>
    </Box>
  );
};

export default SignInForm;