import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import the library

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
  roles: string[];
  permissions: string[];
}

interface AuthContextType extends UserDetails {
  token: string | null;
  isAuthenticated: boolean;
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
    roles: [],
    permissions: [],
  });
  const [isLoading, setIsLoading] = useState(true); // Start loading

  // Function to update user details from token
  const updateUserFromToken = (currentToken: string | null) => {
    if (currentToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(currentToken);
        console.log("Decoded Token:", decoded); // Log decoded token for debugging

        // Extract roles - check for 'roles' or 'authorities' claim
        let userRoles: string[] = [];
        if (Array.isArray(decoded.roles)) {
          userRoles = decoded.roles;
        } else if (Array.isArray(decoded.authorities)) {
          userRoles = decoded.authorities;
        }
        console.log("Extracted Roles:", userRoles); // Log extracted roles

        // Extract permissions
        const userPermissions = Array.isArray(decoded.permissions) ? decoded.permissions : [];

        setUserDetails({
          username: decoded.sub || null,
          roles: userRoles,
          permissions: userPermissions,
        });
      } catch (error) {
         console.error("Failed to decode token with jwt-decode:", error);
         // If decoding fails, clear user details
         setUserDetails({ username: null, roles: [], permissions: [] });
      }
    } else {
      setUserDetails({ username: null, roles: [], permissions: [] }); // Clear details if no token
    }
  };

  // Check localStorage for token on initial load
  useEffect(() => {
    let storedToken: string | null = null;
    try {
      storedToken = localStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        updateUserFromToken(storedToken); // Decode token on load
      }
    } catch (error) {
      console.error("Error reading token from localStorage:", error);
      // Handle potential errors (e.g., localStorage disabled)
    } finally {
      setIsLoading(false); // Finished loading check
    }
  }, []);

  const login = (newToken: string) => {
    try {
      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      updateUserFromToken(newToken); // Decode token on login
    } catch (error) {
      console.error("Error saving token to localStorage:", error);
      // Handle potential errors
    }
  };

  const logout = () => {
    try {
      localStorage.removeItem('authToken');
      setToken(null);
      updateUserFromToken(null); // Clear user details on logout
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
    username: userDetails.username,
    roles: userDetails.roles,
    permissions: userDetails.permissions,
  };

  // Don't render children until the initial token check is complete
  // This prevents rendering protected routes before knowing the auth state
  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading authentication state...</div>; // Basic loading indicator
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};