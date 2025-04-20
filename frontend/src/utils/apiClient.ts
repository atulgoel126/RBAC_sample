import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

// Create an Axios instance
const apiClient = axios.create({
  // The Vite proxy handles redirecting /api to the backend,
  // so we can use /api as the baseURL for requests made from the frontend.
  baseURL: '/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('authToken'); 
    
    // If the token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config; // Return the modified config
  },
  (error) => {
    // Handle request error here
    console.error('Axios request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Optional: Add a response interceptor for global error handling (e.g., 401 Unauthorized)
apiClient.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error: AxiosError) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    console.error('API Error:', error.response?.data || error.message);

    let errorMessage = 'An unexpected error occurred.';

    if (error.response) {
      // Server responded with a status code outside the 2xx range
      const responseData = error.response.data as any; // Type assertion for flexibility
      errorMessage = responseData?.message || responseData?.error || `Request failed with status ${error.response.status}`;

      // Specific handling for 401 Unauthorized
      if (error.response.status === 401) {
        errorMessage = 'Session expired or invalid. Please log in again.';
        console.warn('Unauthorized (401) request detected.');
        // Clear the potentially invalid token
        localStorage.removeItem('authToken');
        // TODO: Implement cleaner logout/redirect logic, perhaps via AuthContext
        // For now, we'll just show the toast and let ProtectedRoute handle redirect if applicable
        // or the user can manually navigate to login.
        // Consider triggering the logout function from AuthContext here if possible.
      }
      // Add specific messages for other common errors if needed (e.g., 403 Forbidden, 404 Not Found)
      else if (error.response.status === 403) {
         errorMessage = responseData?.message || 'You do not have permission to perform this action.';
      } else if (error.response.status === 404) {
         errorMessage = responseData?.message || 'The requested resource was not found.';
      } else if (error.response.status >= 500) {
         errorMessage = responseData?.message || 'A server error occurred. Please try again later.';
      }

    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your network connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message || 'Error setting up the request.';
    }

    // Display the error message using react-toastify
    toast.error(errorMessage);

    return Promise.reject(error); // Pass the error along for component-level handling if needed
  }
);


export default apiClient;