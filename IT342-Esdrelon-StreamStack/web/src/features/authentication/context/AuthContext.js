import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * OBSERVER PATTERN - Context (Subject)
 * Manages user authentication state and notifies all observers (components)
 */
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Observers list (components subscribed to auth state)
  const [observers, setObservers] = useState([]);
  
  // Initialize - check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setIsAuthenticated(true);
      notifyObservers('LOGIN', userData);
    }
    
    setIsLoading(false);
  }, []);
  
  /**
   * Notify all observers of state change
   */
  const notifyObservers = (action, data) => {
    observers.forEach(observer => {
      if (observer.onAuthChange) {
        observer.onAuthChange(action, data);
      }
    });
  };
  
  /**
   * Subscribe to auth changes (Observer pattern)
   */
  const subscribe = (observer) => {
    setObservers(prev => [...prev, observer]);
    
    // Return unsubscribe function
    return () => {
      setObservers(prev => prev.filter(obs => obs !== observer));
    };
  };
  
  /**
   * Login - notify all observers
   */
  const login = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
    
    // Notify all observers
    notifyObservers('LOGIN', userData);
  };
  
  /**
   * Logout - notify all observers
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    setUser(null);
    setIsAuthenticated(false);
    
    // Notify all observers
    notifyObservers('LOGOUT', null);
  };
  
  /**
   * Update user profile - notify all observers
   */
  const updateUser = (updatedData) => {
    const newUserData = { ...user, ...updatedData };
    localStorage.setItem('user', JSON.stringify(newUserData));
    
    setUser(newUserData);
    
    // Notify all observers
    notifyObservers('UPDATE', newUserData);
  };
  
  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    subscribe, // Allow components to subscribe
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to use auth context (Observer)
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;