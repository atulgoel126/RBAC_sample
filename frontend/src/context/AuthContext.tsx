import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import the library
import apiClient from '../utils/apiClient'; // Import apiClient

// Define the expected structure of the decoded JWT payload
interface DecodedToken {
  sub?: string; // Subject (usually username or user ID)
  roles?: string[]; // Roles claim (common name)
  authorities?: string[]; // Roles claim (alternative common name, e.g., Spring Security)
  permissions?: string[]; // Permissions claim
  exp?: number; // Expiration time
  iat?: number; // Issued at time
  // Add other claims your backend might include
}


interface UserDetails {
  username: string | null;
  fullName: string | null; // Add fullName
  roles: string[];
  permissions: string[];
}

// Separate UserDetails from AuthContextType for clarity
interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  userDetails: UserDetails; // Embed UserDetails
  login: (newToken: string) => void;
  logout: () => void;
  isLoading: boolean; // To handle initial token loading check
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    username: null,
    fullName: null, // Initialize fullName
    roles: [],
    permissions: [],
  });
  const [isLoading, setIsLoading] = useState(true); // Start loading

  // Function to fetch user profile details (assuming /users/me endpoint)
  const fetchUserProfile = async (username: string): Promise<{ fullName: string | null }> => {
      try {
          // Assuming the backend identifies the user via the token included by apiClient
          const response = await apiClient.get(`/users/profile/${username}`); // Or potentially just /users/me
          return { fullName: response.data?.fullName || null };
      } catch (error) {
          console.error("Failed to fetch user profile:", error);
          return { fullName: null }; // Return null on error
      }
  };

  // Function to update user details from token and fetch profile
  const loadUserDetails = async (currentToken: string | null) => {
    if (currentToken) {
      let decoded: DecodedToken | null = null;
      try {
        decoded = jwtDecode<DecodedToken>(currentToken);
        console.log("Decoded Token:", decoded);

        // Extract roles
        let userRoles: string[] = [];
        if (Array.isArray(decoded.roles)) {
          userRoles = decoded.roles;
        } else if (Array.isArray(decoded.authorities)) {
          userRoles = decoded.authorities;
        }
        console.log("Extracted Roles:", userRoles); // Log extracted roles

        // Extract permissions
        const userPermissions = Array.isArray(decoded.permissions) ? decoded.permissions : [];

        const username = decoded?.sub || null;
        // Explicitly type profileDetails
        let profileDetails: { fullName: string | null } = { fullName: null };

        if (username) {
            // Fetch additional profile details if username exists
            profileDetails = await fetchUserProfile(username);
        }

        setUserDetails({
          username: username,
          fullName: profileDetails.fullName, // Set fullName from fetched profile
          roles: userRoles,
          permissions: userPermissions,
        });

      } catch (error) {
         console.error("Failed to decode token or fetch profile:", error);
         // Clear details on any error during the process
         setUserDetails({ username: null, fullName: null, roles: [], permissions: [] });
      }
    } else {
      setUserDetails({ username: null, fullName: null, roles: [], permissions: [] }); // Clear details if no token
    }
  };

  // Check localStorage for token on initial load
  useEffect(() => {
    // Use an async IIFE inside useEffect
    (async () => {
      let storedToken: string | null = null;
      try {
        storedToken = localStorage.getItem('authToken');
        if (storedToken) {
          setToken(storedToken);
          await loadUserDetails(storedToken); // Load details on initial load
        }
      } catch (error) {
      console.error("Error reading token from localStorage:", error);
        console.error("Error reading token from localStorage:", error);
        // Handle potential errors (e.g., localStorage disabled)
      } finally {
        setIsLoading(false); // Finished loading check
      }
    })(); // Immediately invoke the async function
  }, []);

  const login = async (newToken: string) => { // Make login async
    try {
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      await loadUserDetails(newToken); // Load details on login
    } catch (error) {
      console.error("Error saving token to localStorage:", error);
      // Handle potential errors
    }
  };

  const logout = async () => { // Make logout async
    try {
      localStorage.removeItem('authToken');
      setToken(null);
      await loadUserDetails(null); // Clear user details on logout
    } catch (error) {
      console.error("Error removing token from localStorage:", error);
      // Handle potential errors
    }
  };

  const isAuthenticated = !!token; // User is authenticated if token exists

  const value: AuthContextType = {
    token,
    isAuthenticated,
    login,
    logout,
    isLoading,
    // Pass the whole userDetails object
    userDetails: userDetails,
  };

  // Don't render children until the initial token check is complete
  // This prevents rendering protected routes before knowing the auth state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading authentication state...</div>; // Basic loading indicator
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => { // Return type inference is usually fine here
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};