import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import apiClient from '../utils/apiClient';
import { AxiosError } from 'axios';
import { Input, Label, Button, FormErrorMessage } from '../components/ui'; // Import FormErrorMessage

// Define the type for our form data
type RegistrationFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string; // Add confirm password field
};

// Remove unused style constants
// const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
// const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100";
// const buttonStyle = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50";
// const errorTextStyle = "mt-1 text-xs text-red-600"; // Remove unused style
const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline";
const successTextStyle = "mt-2 text-sm text-green-600 text-center";

function RegistrationPage() {
  const [apiError, setApiError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit,
    watch, // Import watch to get password value for comparison
    formState: { errors, isSubmitting }
  } = useForm<RegistrationFormData>();

  // Watch the password field to use its value in validation
  const passwordValue = watch('password');

  const onSubmit: SubmitHandler<RegistrationFormData> = async (data) => {
    setApiError(null);
    setSuccessMessage(null);
    console.log('Attempting registration with:', data);

    try {
      const response = await apiClient.post('/auth/signup', data); 
      console.log('Registration successful:', response.data);
      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000); 
    } catch (err) {
      console.error('Registration API error:', err);
      let errorMessage = 'Registration failed. Please try again.';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setApiError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8"> {/* Center the form */}
      <h1 className="text-2xl font-bold text-center mb-6">Register New User</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1"> {/* Add spacing for label/input */}
          <Label htmlFor="fullName">Full Name:</Label>
          <Input
            type="text"
            id="fullName"
            error={!!errors.fullName} // Pass error prop
            {...register("fullName", { required: "Full Name is required" })}
            disabled={isSubmitting}
          />
          <FormErrorMessage>{errors.fullName?.message}</FormErrorMessage> {/* Use component */}
        </div>
        <div className="space-y-1"> {/* Add spacing */}
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
          />
          <FormErrorMessage>{errors.email?.message}</FormErrorMessage> {/* Use component */}
        </div>
        <div className="space-y-1"> {/* Add spacing */}
          <Label htmlFor="password">Password:</Label>
          <Input
            type="password"
            id="password"
            error={!!errors.password} // Pass error prop
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" }
            })}
            disabled={isSubmitting}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage> {/* Use component */}
        </div>
        <div className="space-y-1"> {/* Add spacing */}
          <Label htmlFor="confirmPassword">Confirm Password:</Label>
          <Input
            type="password"
            id="confirmPassword"
            error={!!errors.confirmPassword} // Pass error prop
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: value =>
                value === passwordValue || "Passwords do not match"
           })}
           disabled={isSubmitting}
         />
         <FormErrorMessage>{errors.confirmPassword?.message}</FormErrorMessage> {/* Use component */}
       </div>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}
        {successMessage && <p className={successTextStyle}>{successMessage}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full"> {/* Use Button component */}
          {isSubmitting ? 'Registering...' : 'Register'}
        </Button>
      </form>
      <nav className="mt-4 text-center space-x-4">
        <Link to="/login" className={linkStyle}>Already have an account? Login</Link>
        <Link to="/" className={linkStyle}>Go to Home</Link>
      </nav>
    </div>
  );
}

export default RegistrationPage;