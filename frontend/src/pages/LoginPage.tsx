import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form'; 
import { useAuth } from '../context/AuthContext';
import apiClient from '../utils/apiClient'; 
import { AxiosError } from 'axios'; 

// Define the type for our form data
type LoginFormData = {
  email: string;
  password: string;
};

// Common Tailwind styles (can be moved to a shared location later)
const labelStyle = "block text-sm font-medium text-gray-700 mb-1";
const inputStyle = "mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-100";
const buttonStyle = "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50";
const errorTextStyle = "mt-1 text-xs text-red-600";
const linkStyle = "text-sm text-indigo-600 hover:text-indigo-800 hover:underline";

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
        <div>
          <label htmlFor="email" className={labelStyle}>Email:</label>
          <input
            type="email"
            id="email"
            className={`${inputStyle} ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`} // Highlight on error
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              } 
            })}
            disabled={isSubmitting} 
          />
          {errors.email && <p className={errorTextStyle}>{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className={labelStyle}>Password:</label>
          <input
            type="password"
            id="password"
            className={`${inputStyle} ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`} // Highlight on error
            {...register("password", { required: "Password is required" })}
            disabled={isSubmitting}
          />
          {errors.password && <p className={errorTextStyle}>{errors.password.message}</p>}
        </div>
        
        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{apiError}</span>
          </div>
        )}

        <button type="submit" disabled={isSubmitting} className={buttonStyle}>
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <nav className="mt-4 text-center space-x-4">
        <Link to="/register" className={linkStyle}>Don't have an account? Register</Link>
        <Link to="/" className={linkStyle}>Go to Home</Link>
      </nav>
    </div>
  );
}

export default LoginPage;