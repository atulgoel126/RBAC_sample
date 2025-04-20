import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'; // Added InternalAxiosRequestConfig
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

// Flag to prevent infinite refresh loops
let isRefreshing = false;
// Store requests that failed due to 401 to retry them later
let failedQueue: { resolve: (value: unknown) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Add a response interceptor for global error handling AND token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Success case: just return the response
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }; // Add _retry flag type

    // Check if it's a 401 error and not a retry request already
    if (error.response?.status === 401 && !originalRequest._retry) {

      // If we are already refreshing, queue the request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
          }
          return apiClient(originalRequest); // Retry with new token
        }).catch(err => {
          return Promise.reject(err); // Propagate the error if refresh failed
        });
      }

      // Mark that we are refreshing and set the retry flag
      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        console.error('No refresh token found. Logging out.');
        isRefreshing = false;
        localStorage.removeItem('authToken'); // Ensure access token is also cleared
        // Dispatch custom event for logout
        window.dispatchEvent(new CustomEvent('logoutRequired'));
        processQueue(error, null); // Reject queued requests
        toast.error('Session expired. Please log in again.');
        return Promise.reject(error);
      }

      try {
        console.log('Attempting token refresh...');
        // Use axios directly to avoid interceptor loop for the refresh call
        const refreshResponse = await axios.post('/api/auth/refresh', { refreshToken });
        const newAccessToken = refreshResponse.data.accessToken;

        console.log('Token refresh successful.');
        localStorage.setItem('authToken', newAccessToken);

        // Dispatch custom event with the new token
        window.dispatchEvent(new CustomEvent('tokenRefreshed', { detail: newAccessToken }));

        // Update the header of the original request
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken); // Resolve queued requests with new token
        isRefreshing = false;

        // Retry the original request with the new token
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        isRefreshing = false;
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        // Dispatch custom event for logout
        window.dispatchEvent(new CustomEvent('logoutRequired'));
        processQueue(refreshError as AxiosError, null); // Reject queued requests with refresh error
        toast.error('Session expired. Please log in again.');
        return Promise.reject(refreshError); // Reject with the refresh error
      }
    }

    // --- Existing Error Handling for non-401 errors ---
    console.error('API Error:', error.response?.data || error.message);
    let errorMessage = 'An unexpected error occurred.';
    if (error.response) {
      const responseData = error.response.data as BackendErrorResponse;
      if (responseData?.validationErrors && typeof responseData.validationErrors === 'object' && Object.keys(responseData.validationErrors).length > 0) {
        errorMessage = "Validation failed: " + Object.entries(responseData.validationErrors)
          .map(([field, message]) => `${field}: ${message}`)
          .join('; ');
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      } else if (responseData?.error) {
        errorMessage = responseData.error;
      } else {
        errorMessage = `Request failed with status ${error.response.status}`;
      }

      // Add specific messages for other common errors if needed
      if (error.response.status === 403 && errorMessage.startsWith('Request failed')) {
         errorMessage = 'You do not have permission to perform this action.';
      } else if (error.response.status === 404 && errorMessage.startsWith('Request failed')) {
         errorMessage = 'The requested resource was not found.';
      } else if (error.response.status >= 500 && errorMessage.startsWith('Request failed')) {
         errorMessage = 'A server error occurred. Please try again later.';
      }
    } else if (error.request) {
      errorMessage = 'No response from server. Please check your network connection.';
    } else {
      errorMessage = error.message || 'Error setting up the request.';
    }

    // Display the error message using react-toastify (only if not a 401 handled by refresh logic)
    if (error.response?.status !== 401) {
        toast.error(errorMessage);
    }

    return Promise.reject(error); // Reject with the original error for other statuses
  }
);

export default apiClient;