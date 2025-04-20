import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';

// Define a more specific type for expected error responses
interface BackendErrorResponse {
  message?: string;
  error?: string;
  validationErrors?: { [key: string]: string }; // For structured validation errors
  // Add other potential fields if known
}


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
      const responseData = error.response.data as BackendErrorResponse; // Use the specific interface

      // --- Improved Error Message Extraction ---
      if (responseData?.validationErrors && typeof responseData.validationErrors === 'object' && Object.keys(responseData.validationErrors).length > 0) {
        // Handle structured validation errors (from MethodArgumentNotValidException)
        // Combine field errors into a single message for the toast
        errorMessage = "Validation failed: " + Object.entries(responseData.validationErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('; ');
        // Note: Individual forms might still want to handle these errors specifically
        // by catching the rejection and accessing error.response.data.validationErrors
      } else if (responseData?.message) {
        // Use the primary message field if available
        errorMessage = responseData.message;
      } else if (responseData?.error) {
         // Fallback to error field
        errorMessage = responseData.error;
      } else {
         // Fallback based on status code if no specific message found
         errorMessage = `Request failed with status ${error.response.status}`;
      }
      // --- End Improved Extraction ---


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
      // Add specific messages for other common errors if needed
      // Use the already extracted/formatted errorMessage here, but provide defaults if it's still generic
      else if (error.response.status === 403 && errorMessage.startsWith('Request failed')) {
         errorMessage = 'You do not have permission to perform this action.';
      } else if (error.response.status === 404 && errorMessage.startsWith('Request failed')) {
         errorMessage = 'The requested resource was not found.';
      } else if (error.response.status >= 500 && errorMessage.startsWith('Request failed')) {
         errorMessage = 'A server error occurred. Please try again later.';
      }
      // Note: For 400 Bad Request with validation errors, the specific message is constructed above.

    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check your network connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = error.message || 'Error setting up the request.';
    }

    // Display the error message using react-toastify
    toast.error(errorMessage);

    // Return a rejected promise with the error, including the potentially structured validation errors
    // This allows components to optionally handle specific validation errors if needed.
    return Promise.reject(error);
  }
);


export default apiClient;