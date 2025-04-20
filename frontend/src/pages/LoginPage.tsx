import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import apiClient from '../utils/apiClient';
import { AxiosError } from 'axios';
import { Button, Input, Label, FormErrorMessage } from '../components/ui'; // Import FormErrorMessage
import { linkStyle } from '../styles/commonStyles'; // Remove errorTextStyle import

// Define the type for our form data
type LoginFormData = {
  email: string;
  password: string;
};

// Removed local style constants

function LoginPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setApiError(null);
    console.log('Attempting login with:', data);
    try {
      const response = await apiClient.post('/auth/signin', data);
      const responseData = response.data;
      if (responseData && responseData.token) {
        login(responseData.token);
        navigate('/');
      } else {
        throw new Error('Login successful, but no token received.');
      }
    } catch (err) {
      console.error('Login API error:', err);
      let errorMessage = 'Login failed. Please check your credentials.';
      if (err instanceof AxiosError && err.response?.status !== 401) { // Don't show generic for 401
         errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || errorMessage;
      } else if (err instanceof Error && !(err instanceof AxiosError)) {
         errorMessage = err.message;
      } // Keep default message for 401 or unknown Axios errors
      setApiError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8"> {/* Center the form */}
      <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid w-full max-w-sm items-center gap-1.5"> {/* Added wrapper for better label spacing */}
          <Label htmlFor="email">Email:</Label>
          <Input
            type="email"
            id="email"
            error={!!errors.email} // Pass error prop
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })}
            disabled={isSubmitting}
            placeholder="you@example.com"
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage> {/* Use component */}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5"> {/* Added wrapper for better label spacing */}
          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            id="password"
            error={!!errors.password} // Pass error prop
            {...register("password", { required: "Password is required" })}
            disabled={isSubmitting}
            placeholder="Enter your password"
          />
           <FormErrorMessage>{errors.password?.message}</FormErrorMessage> {/* Use component */}
        </div>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full" // Apply full width
          variant="primary" // Use the primary style variant
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
      <nav className="mt-4 text-center space-x-4">
         {/* Use common linkStyle */}
        <Link to="/register" className={linkStyle}>Don't have an account? Register</Link>
        <Link to="/" className={linkStyle}>Go to Home</Link>
      </nav>
    </div>
  );
}

export default LoginPage;